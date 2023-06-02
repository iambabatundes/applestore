import React, { useState } from "react";
import "../components/styles/faq.css";

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(1);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqData = [
    {
      title: "Is it true that an apple a day keeps the doctor away?",
      description:
        "Absolutely! An apple a day not only keeps the doctor away but also brings you closer to orchard-fresh goodness and a smile on your face. With its natural sweetness, crisp texture, and a wide variety of flavors to choose from, apples are the perfect healthy snack to boost your immune system and keep you feeling fabulous. So go ahead, take a juicy bite and let the apple magic work its wonders!",
      icon: "fa fa-plus",
    },
    {
      title:
        "Are all apples the same, or are there different varieties to explore?",
      description:
        "Oh, my dear apple aficionado, you're in for a delightful surprise! The apple world is a vibrant kaleidoscope of flavors and textures. From the tart and tangy Granny Smith to the honeyed and fragrant Pink Lady, each apple variety brings its own unique personality to the orchard party. So, put on your tasting hat and embark on an apple adventure to discover your favorite flavor symphony. It's a fruity treasure hunt you won't want to miss!",
      icon: "fa fa-plus",
    },
    {
      title: "Can I use apples for more than just snacking?",
      description:
        "Absolutely! Apples are the versatile stars of the fruit kingdom, ready to shine in a variety of culinary creations. Get creative in the kitchen and explore the endless possibilities – slice them into salads, bake them into pies and tarts, turn them into luscious applesauce or even juice them for a refreshing beverage. Apples are here to show you that they're not just a snack; they're culinary magicians ready to make every dish taste extraordinary.",
      icon: "fa fa-plus",
    },
    {
      title: "How can I keep my apples fresh for longer?",
      description:
        "Ah, the secret to apple freshness lies in a few simple tricks. First, find a cool spot in your kitchen or refrigerator to store them. Second, separate them from other fruits and vegetables to prevent premature ripening. And if you really want to keep them crisp and fresh, store them in a breathable bag to maintain optimal humidity. But remember, the best way to enjoy apples is by devouring them quickly because their deliciousness is simply irresistible!",
      icon: "fa fa-plus",
    },
    {
      title: "Are organic apples worth the extra cost?",
      description:
        "Organic apples are like the superheroes of the apple world, grown with extra love and care for both you and the environment. While they may be a bit pricier, they're worth every penny. Organic farming practices prioritize natural methods, avoiding synthetic pesticides and focusing on sustainability. So not only are you getting a tasty, wholesome fruit, but you're also supporting a healthier planet. Treat yourself to the goodness of organic apples and savor the taste of guilt-free indulgence!",
      icon: "fa fa-plus",
    },
  ];

  return (
    <section className="faq">
      {faqData.map((item, index) => (
        <div className="faq-item" key={index}>
          <section
            className={`faq-item__title ${
              activeIndex === index ? "active" : ""
            }`}
            onClick={() => toggleAccordion(index)}
          >
            <h3>{item.title}</h3>
            <i className={`fa ${item.icon}`} aria-hidden="true"></i>
          </section>
          {activeIndex === index && (
            <span className="faq-item__content">{item.description}</span>
          )}
        </div>
      ))}
    </section>
  );
}
