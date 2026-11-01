import { useEffect, useRef, useState } from "react";
import { FaGithub, FaTelegram } from "react-icons/fa";
import { MdOutlineMail, MdOutlinePhone, MdOutlineContactPage } from "react-icons/md";
import { person, channels } from "../data/contact";
import { QR_PATH } from "../data/qr";
import { downloadVCard } from "../lib/vcard";
import Lanyard from "./Lanyard";
import ThemeToggle from "./ThemeToggle";
import "./ContactCard.css";

const ICONS = {
  github: FaGithub,
  email: MdOutlineMail,
  telegram: FaTelegram,
  phone: MdOutlinePhone,
};

function ContactCard() {
  const [saved, setSaved] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);

  function save() {
    downloadVCard({ person, channels }, "Samuel-Mifta.vcf");
    setSaved(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setSaved(false), 5000);
  }

  const telegram = channels.find((c) => c.id === "telegram");

  return (
    <div className="stage">
      <ThemeToggle />

      <Lanyard>
        <div className="who">
          <span className="mono" aria-hidden="true">
            <span className="mk" />
          </span>
          <div>
            <h1>
              {person.first} {person.last}
            </h1>
            <small>{person.role}</small>
          </div>
        </div>

        <ul className="ct">
          {channels.map((c) => {
            const Icon = ICONS[c.id];
            return (
              <li key={c.id}>
                <a
                  href={c.href}
                  {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  <Icon aria-hidden="true" />
                  <span className="sr">{c.label}: </span>
                  {c.value}
                </a>
              </li>
            );
          })}
        </ul>

        <a
          className="qr"
          href={telegram.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Scan to open Samuel on Telegram"
        >
          <svg viewBox="-3 -3 35 35" shapeRendering="crispEdges" role="img" aria-label="QR code for t.me/sami7ma">
            <rect x="-3" y="-3" width="35" height="35" fill="#fff" />
            <path fill="#14100c" d={QR_PATH} />
          </svg>
          <span>scan · t.me/sami7ma</span>
        </a>

        <p className="sec">Section {person.section}</p>
      </Lanyard>

      <div className="after">
        <button type="button" className={`copy save${saved ? " got" : ""}`} onClick={save}>
          <MdOutlineContactPage aria-hidden="true" />
          <span>{saved ? "Saved" : "Save contact"}</span>
        </button>
        <p className="note" role="status">
          {saved ? "Samuel-Mifta.vcf is in your downloads." : "Tip: pull the card, it snaps back."}
        </p>
      </div>
    </div>
  );
}

export default ContactCard;
