import { getRoast } from "@/app/actions/roast";
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
// App router includes @vercel/og.
// No need to install it.

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
          background: "white",
          width: "100%",
          height: "100%",
          padding: "60px 60px",
          textAlign: "left",
          justifyContent: "center",
          alignItems: "flex-start",
          display: "flex",
          position: "relative",
          flexDirection: "column",
        }}
      >
        <p
          style={{
            letterSpacing: 10,
            fontSize: 26,
            margin: 0,
            marginBottom: 20,
            color: "#71717a",
          }}
        >
          HUGGER ROASTER
        </p>
        <p
          style={{
            fontSize: 40,
            margin: 0,
            lineHeight: 1.3,
            color: "##27272a",
            whiteSpace: "break-spaces",
            lineClamp: 2,
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
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
