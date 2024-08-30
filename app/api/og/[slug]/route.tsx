import { getRoast } from "@/app/actions/roast";
import Image from "next/image";
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

import Logo from "@/assets/logo.svg";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  const roast = await getRoast({ id: slug });

  if (!roast?.data) {
    return undefined;
  }

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 40,
          color: "black",
          background: "#f4f4f5",
          width: "100%",
          height: "100%",
          padding: "40px",
          textAlign: "left",
          justifyContent: "center",
          alignItems: "flex-start",
          display: "flex",
          position: "relative",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            overflow: "hidden",
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            // border: "1px solid #d4d4d8",
            background: "white",
            borderRadius: 40,
            padding: "60px 50px",
            boxShadow:
              "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
          }}
        >
          <div
            style={{
              letterSpacing: 10,
              fontSize: 26,
              margin: 0,
              marginBottom: 20,
              color: "#71717a",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <img
              src="https://huggingface.co/front/assets/huggingface_logo-noborder.svg"
              alt="logo hugging face"
              style={{
                width: 50,
                height: 50,
                marginRight: 20,
                objectFit: "contain",
              }}
            />
            HUGGER ROASTER
          </div>
          <p
            style={{
              fontSize: 35,
              margin: 0,
              lineHeight: 1.4,
              color: "#3f3f46",
              whiteSpace: "break-spaces",
              lineClamp: 2,
              marginTop: 10,
            }}
          >
            {roast.data.text}...
          </p>
          <p
            style={{
              position: "absolute",
              bottom: -100,
              right: -10,
              fontSize: 240,
              opacity: 0.5,
            }}
          >
            🧨
          </p>
          <div
            style={{
              width: "100vw",
              height: "200px",
              background:
                "linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, white 100%)",
              position: "absolute",
              bottom: 0,
              left: 0,
            }}
          ></div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
