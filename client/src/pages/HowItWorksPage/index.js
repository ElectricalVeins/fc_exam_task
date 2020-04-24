import React    from 'react';
import { Link } from 'react-router-dom'
import Header   from "../../components/Header/Header";
import styles   from './HowItWorksPage.module.sass'
import faq      from './faq.json'
import Footer   from "../../components/Footer/Footer";

const HowItWorks = props => {

  const renderFaq = () => ( faq.map( ( item, index ) => ( <li key={index}>
    <h4>{item.question}</h4>
    <p>{item.answer}</p>
  </li> ) ) )

  return (
    <>
      <Header id='header'/>
      <div className={styles.wrapper}>
        <main className={styles.howSection}>
          {/* <video className={styles.video}
           src="https://fast.wistia.net/embed/iframe/vfxvect60o">Your
           browser doesn't support this media
           </video>*/}
          <div className={styles.video}>
            <iframe title="Wistia video player"
                    allowFullScreen
                    frameBorder="0"
                    scrolling="no"
                    src="https://fast.wistia.net/embed/iframe/vfxvect60o"
                    width="555"
                    height="312"/>
          </div>
          <div className={styles.main}>
            <h2>How Does Squadhelp Work?</h2>
            <p>Squadhelp allows you to host branding competitions to engage with the most creative
              people across the globe and get high-quality results, fast. Thousands of creatives
              compete with each other, suggesting great name ideas. At the end of the collaborative
              contest, you select one winner. The winner gets paid, and you get a strong brand name
              that will help you succeed! It's quick, simple, and costs a fraction of an agency.
            </p>
          </div>
        </main>
        <h2 className={styles.stepsHeader}>5 Simple Steps</h2>
        <section className={styles.stepContainer}>

          <div className={styles.step}>
            <div>1</div>
            <h4>Start Your Contest</h4>
            <p>Complete our fast, easy project brief template, and we’ll share it with our community
              of more than 70,000 Creatives.</p>
          </div>

          <div className={styles.step}>
            <div>2</div>
            <h4>Ideas Start Pouring In</h4>
            <p>You will start receiving name ideas - created specifically for you - within minutes.
              Dozens of contestants work for you at the same time! A typical naming contest receives
              several hundred name ideas. All ideas are automatically checked for URL
              availability.</p>
          </div>

          <div className={styles.step}>
            <div>3</div>
            <h4>Collaborate and Communicate</h4>
            <p>See all your submissions from your contest dashboard. Rate entries, leave private
              comments, and send public messages, leading the process towards the perfect name.</p>
          </div>

          <div className={styles.step}>
            <div>4</div>
            <h4>Validate</h4>
            <p>Choose your name with confidence. Our unique validation process includes domain
              checks, trademark risk assessment, linguistics analysis, and professional audience
              testing.</p>
          </div>

          <div className={styles.step}>
            <div>5</div>
            <h4>Pick your winner!</h4>
            <p>Once your contest ends, announce the winner - and register the name. Come back to
              Squadhelp to launch a Logo Design or Tagline project for your name.</p>
          </div>

        </section>
        <section className={styles.contestLinkContainer}>
          <Link to='/startContest'>Start a contest</Link>
        </section>
        <section className={styles.faqContainer}>
          <div className={styles.faqTitle}>
            <div>?</div>
            <h4>Frequently Asked Questions</h4>
          </div>
          <ul>
            {
              renderFaq()
            }
          </ul>
        </section>

      </div>
      <div className={styles.getInTouch}>

        <div className={styles.envelopeIcon}>
          <i className="fa fa-envelope" aria-hidden="true"/>
        </div>

        <div className={styles.touchInfo}>
          <h1>
            Questions?
          </h1>
          <p>Check out our <a href="#header">FAQs</a> or send us a <a href="#header">message</a>.
            For assistance with launching a contest, you can also call us at (877) 355-3585 or
            schedule a <a href="#header">Branding Consultation</a>
          </p>
        </div>

        <div className={styles.touchButton}>
          <a target='_blank' href='#header'>Get in Touch</a>
        </div>

      </div>
      <a href='#header' className={styles.scrollUp}><i className='fa'></i></a>
      <Footer/>
    </>
  );
};

export default HowItWorks;
