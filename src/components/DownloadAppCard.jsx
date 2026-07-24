import playStore from "../assets/playStore.png";
import QRCode from "react-qr-code";

export default function DownloadAppCard() {
  return (
    <>
      <style>{`
        .download-card {
          margin-top: 1rem;
          width: fit-content;
          max-width: 280px;
          padding: 9px 14px;
          border-radius: 11px;
          background: linear-gradient(
            135deg,
            rgba(255,255,255,.18) 0%,
            rgba(255,255,255,.06) 60%,
            rgba(255,255,255,.13) 100%
          );
          backdrop-filter: blur(20px) saturate(1.5);
          -webkit-backdrop-filter: blur(20px) saturate(1.5);
          border: 1px solid rgba(255,255,255,.28);
          box-shadow:
            0 8px 32px rgba(0,0,0,.18),
            inset 0 1px 0 rgba(255,255,255,.35);
          overflow: hidden;
          position: relative;
          z-index: 2;
          transition: .3s ease;
        }

        /* gloss shine */
        .download-card::before {
          content: "";
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 50%;
          background: linear-gradient(
            180deg,
            rgba(255,255,255,.22) 0%,
            rgba(255,255,255,0) 100%
          );
          pointer-events: none;
          border-radius: 14px 14px 0 0;
        }

        .download-card:hover {
          background: linear-gradient(
            135deg,
            rgba(255,255,255,.25) 0%,
            rgba(255,255,255,.09) 60%,
            rgba(255,255,255,.18) 100%
          );
          box-shadow:
            0 12px 40px rgba(0,0,0,.22),
            inset 0 1px 0 rgba(255,255,255,.45);
        }

        .download-title {
          font-size: 11px;
          font-weight: 700;
          color: #fff;
          text-align: center;
          margin: 0 0 2px;
          position: relative;
          z-index: 2;
          text-shadow: 0 1px 4px rgba(0,0,0,.2);
        }

        .download-desc {
          font-size: 9px;
          line-height: 1.4;
          text-align: center;
          color: rgba(255,255,255,.78);
          margin: 0 0 8px;
          position: relative;
          z-index: 2;
        }

        .download-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          position: relative;
          z-index: 2;
        }

        .play-img {
          width: 100px;
          transition: .3s;
          cursor: pointer;
          filter: drop-shadow(0 4px 10px rgba(0,0,0,.25));
        }
        .play-img:hover { transform: scale(1.05); }

        .download-divider-v {
          width: 1px;
          height: 44px;
          background: rgba(255,255,255,.25);
          flex-shrink: 0;
        }

        .qr-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
        }

        .qr-wrap {
          background: #fff;
          padding: 4px;
          border-radius: 6px;
          line-height: 0;
          box-shadow: 0 4px 12px rgba(0,0,0,.15);
        }

        .qr-text {
          font-size: 9px;
          color: rgba(255,255,255,.8);
        }

        @media(max-width:768px){
          .download-card { display: none; }
        }
      `}</style>

      <div className="download-card">
        <h3 className="download-title">حمل التطبيق الرسمي للمنصة</h3>
        <p className="download-desc">استمتع بنفس خدمات المنصة في أي وقت ومن أي مكان</p>

        <div className="download-content">
          <a
            href="https://play.google.com/store/apps/details?id=appinventor.ai_neamatahmed04.version_3_final_user236_copy"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={playStore} alt="Google Play" className="play-img" />
          </a>

          <div className="download-divider-v" />

          <div className="qr-box">
            <div className="qr-wrap">
              <QRCode
                value="https://play.google.com/store/apps/details?id=appinventor.ai_neamatahmed04.version_3_final_user236_copy"
                size={42}
              />
            </div>
            <span className="qr-text">امسح للتحميل</span>
          </div>
        </div>
      </div>
    </>
  );
}