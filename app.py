import gradio as gr
import requests
import json
import sqlite3
from pathlib import Path
import spaces
import torch
from transformers import pipeline

DB_PATH = Path("roasts.db")

pipe = pipeline(
    "text-generation",
    model="meta-llama/Llama-3.1-8B-Instruct",
    device_map="auto",
    torch_dtype=torch.bfloat16,
)


def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS quotes (
            id TEXT PRIMARY KEY,
            hf_user TEXT NOT NULL,
            text TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """
    )
    conn.commit()
    conn.close()


init_db()


def check_user(username):
    try:
        response = requests.get(f"https://huggingface.co/api/users/{username}/overview")
        if response.status_code == 200:
            return True, response.json()
        return False, None
    except:
        return False, None


def format_informations(
    user, spaces, models, collections, spaces_likes, models_likes, collections_upvotes
):
    return {
        "name": user.get("fullname"),
        "bio": user.get("details"),
        "organizations": [
            {"name": org.get("fullname")} for org in user.get("orgs", [])
        ],
        "followers": user.get("numFollowers"),
        "following": user.get("numFollowing"),
        "total_spaces_likes": spaces_likes,
        "total_models_likes": models_likes,
        "total_collections_likes": collections_upvotes,
        "last_5_spaces": [
            {
                "name": space.get("cardData", {}).get("title")
                or space.get("id", "").split("/")[-1],
                "description": space.get("cardData", {}).get("short_description"),
                "likes_count": space.get("likes"),
                "last_modified": space.get("lastModified"),
                "created_at": space.get("createdAt"),
            }
            for space in spaces[:5]
        ],
        "last_5_models": [
            {
                "name": model.get("id", "").split("/")[-1],
                "has_inference": model.get("inference"),
                "likes_count": model.get("likes"),
                "downloads_count": model.get("downloads"),
                "pipeline_tag": model.get("pipeline_tag"),
                "last_modified": model.get("lastModified"),
                "created_at": model.get("createdAt"),
            }
            for model in models[:5]
        ],
        "last_5_collections": [
            {
                "name": collection.get("title"),
                "description": collection.get("description"),
                "upvotes_count": collection.get("upvotes"),
            }
            for collection in collections[:5]
        ],
    }


def transform_for_inference(datas, language, username):
    if language == "French":
        user_content = f'fais une courte et cruelle critique sarcastique en argot pour le profil Hugging Face suivant en français : {username}. Voici les détails: "{json.dumps(datas)}"'
    elif language == "Spanish":
        user_content = f'haz una crítica corta y cruel para el siguiente perfil de Hugging Face en español: {username}. Aquí están los detalles: "{json.dumps(datas)}"'
    else:
        user_content = f'give a short and harsh roasting for the following hugging face profile: {username}. Here are the details: "{json.dumps(datas)}"'

    return [
        {
            "role": "assistant",
            "content": "You roast people hugging face account based on their bio, name, spaces, and models as harsh and spicy as possible, and keep it short.",
        },
        {"role": "user", "content": user_content},
    ]


@spaces.GPU
def roast_user(username, language):
    if not username:
        return "Please provide a username", None, gr.update(visible=True)

    exists, user = check_user(username)
    if not exists:
        return (
            f"User '{username}' not found on Hugging Face",
            None,
            gr.update(visible=True),
        )

    try:
        spaces_response = requests.get(
            f"https://huggingface.co/api/spaces?author={username}&sort=likes&limit=300&full=false"
        )
        models_response = requests.get(
            f"https://huggingface.co/api/models?author={username}&sort=downloads&limit=300&full=false"
        )
        collections_response = requests.get(
            f"https://huggingface.co/api/collections?owner={username}&limit=100&sort=upvotes&full=false"
        )

        spaces = spaces_response.json() if spaces_response.status_code == 200 else []
        models = models_response.json() if models_response.status_code == 200 else []
        collections = (
            collections_response.json()
            if collections_response.status_code == 200
            else []
        )

        spaces_likes = sum(space.get("likes", 0) for space in spaces)
        models_likes = sum(model.get("likes", 0) for model in models)
        collections_upvotes = sum(
            collection.get("upvotes", 0) for collection in collections
        )

        datas = format_informations(
            user,
            spaces,
            models,
            collections,
            spaces_likes,
            models_likes,
            collections_upvotes,
        )
        messages = transform_for_inference(datas, language, username)

        response = pipe(
            messages,
            max_new_tokens=1024,
            temperature=0.7,
            do_sample=True,
        )

        roast_text = response[0]["generated_text"][-1]["content"]

        return roast_text, username, gr.update(visible=False)

    except Exception as e:
        return f"Error generating roast: {str(e)}", None, gr.update(visible=True)


def save_roast(roast_text, username):
    if not roast_text or not username:
        return "Nothing to share", gr.update(visible=False)

    import uuid

    roast_id = str(uuid.uuid4())[:8]

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO quotes (id, hf_user, text) VALUES (?, ?, ?)",
        (roast_id, username, roast_text),
    )
    conn.commit()
    conn.close()

    share_url = (
        f"https://huggingface.co/spaces/YOUR_USERNAME/hugger-roaster?roast={roast_id}"
    )

    return f"🔗 Share this roast: {share_url}", gr.update(visible=True)


with gr.Blocks() as demo:

    gr.HTML(
        """
        <div style="text-align: center; margin-bottom: 2rem;">
            <h1 style="font-size: 2.5rem; margin-bottom: 0.5rem;">🔥 Hugger Roaster</h1>
            <p style="color: #6b7280;">Roast your favorite Hugging Face user! 👹</p>
        </div>
    """
    )

    with gr.Column():
        with gr.Group():
            username_input = gr.Textbox(
                label="Hugging Face Username",
                placeholder="enzostvs",
                elem_id="username",
            )

            language_select = gr.Radio(
                choices=["English", "French", "Spanish"],
                value="English",
                label="Language",
            )

            roast_btn = gr.Button("Roast this Hugger 🔥", variant="primary", size="lg")

        error_box = gr.Markdown(visible=False)

        with gr.Column(visible=False) as roast_container:
            with gr.Group():
                gr.Markdown("### ROASTING")
                roast_output = gr.Markdown()

                share_btn = gr.Button("Share my roast!", variant="secondary")
                share_output = gr.Markdown(visible=False)

        hidden_username = gr.State()

        def show_roast(roast_text, username):
            if (
                roast_text
                and not roast_text.startswith("Error")
                and not roast_text.startswith("User")
                and not roast_text.startswith("Please")
            ):
                return (
                    gr.update(visible=False),
                    gr.update(visible=True),
                    roast_text,
                    gr.update(visible=False),
                )
            else:
                return (
                    gr.update(value=f"⚠️ {roast_text}", visible=True),
                    gr.update(visible=False),
                    "",
                    gr.update(visible=False),
                )

        roast_btn.click(
            roast_user,
            inputs=[username_input, language_select],
            outputs=[roast_output, hidden_username, error_box],
        ).then(
            show_roast,
            inputs=[roast_output, hidden_username],
            outputs=[error_box, roast_container, roast_output, share_output],
        )

        share_btn.click(
            save_roast,
            inputs=[roast_output, hidden_username],
            outputs=[share_output, share_output],
        )

if __name__ == "__main__":
    demo.launch()
