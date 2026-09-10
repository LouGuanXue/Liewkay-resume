import { contactCta } from '../data/resumeData';
import Reveal from './Reveal';
import SplitText from './SplitText';

/* 联系方式已整体移除（电话 / 邮箱 / 微信），本区块只保留收尾标语与页脚。
   如需恢复，请在 resumeData.js 中补回 contact 字段后再加回展示行。 */
export default function Contact() {
  return (
    <section className="section contact" id="contact">
      <div className="shell">
        <Reveal className="contact__head">
          <span className="contact__eyebrow">CONTACT</span>
          <h2 className="contact__title">
            {contactCta.line1}
            <br />
            <span className="contact__titleAccent">
              <SplitText text={contactCta.line2} step={70} />
            </span>
          </h2>
          <p className="contact__desc">{contactCta.desc}</p>
        </Reveal>

        <footer className="foot">
          <span>© {new Date().getFullYear()} 刘凯</span>
          <span className="foot__sep" aria-hidden="true" />
          <span>React + Vite</span>
        </footer>
      </div>
    </section>
  );
}
