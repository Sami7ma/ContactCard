import "./ContactCard.css";
import {
  FaGithub,
  FaTelegram,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";

function ContactCard() {
  return (
    <div className="card">
      <div className="avatar">SM</div>

      <h1>Samuel Mifta</h1>

      <p className="title">
        Software Engineering Student
      </p>

      <div className="contacts">

        <a
          href="https://github.com/Sami7ma"
          target="_blank"
          rel="noreferrer"
          className="icon-box"
        >
          <FaGithub />
          <span>@Sami7ma</span>
        </a>

        <a
          href="mailto:Samuelmifta@gmail.com"
          className="icon-box"
        >
          <FaEnvelope />
          <span>Samuelmifta@gmail.com</span>
        </a>

        <a
          href="https://t.me/sami7ma"
          target="_blank"
          rel="noreferrer"
          className="icon-box"
        >
          <FaTelegram />
          <span>@sami7ma</span>
        </a>

        <a
          href="tel:+251989972336"
          className="icon-box"
        >
          <FaPhone />
          <span>+251989972336</span>
        </a>

      </div>
    </div>
  );
}

export default ContactCard;
