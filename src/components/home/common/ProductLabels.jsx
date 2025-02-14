import React from "react";

export default function ProductLabels({ promotions }) {
  return (
    <>
      {promotions?.map((promo, index) => (
        <div key={index} className="productCard__promotion">
          <span className="productCard__promotion-name" data-promo={promo.name}>
            <span
              className="productCard__promotion-name"
              data-promo={promo.name}
            >
              {promo.name === "SuperDeal" ? (
                <>
                  <span className="super">Super</span>
                  <span className="deal">Deal</span>
                </>
              ) : promo.name === "WelcomeDeal" ? (
                <>
                  <span className="welcome">Welcome</span>
                  <span className="sdeal">Deal</span>
                </>
              ) : promo.name === "BlackFriday" ? (
                <>
                  <span className="black">Black</span>
                  <span className="friday">Friday</span>
                </>
              ) : promo.name === "CyberMonday" ? (
                <>
                  <span className="cyber">Cyber</span>
                  <span className="monday">Monday</span>
                </>
              ) : promo.name === "HolidaySale" ? (
                <>
                  <span className="holiday">Holiday</span>
                  <span className="sale">Sale</span>
                </>
              ) : promo.name === "FlashSale" ? (
                <>
                  <span className="flash">Flash</span>
                  <span className="sale">Sale</span>
                </>
              ) : (
                promo.name
              )}
            </span>
          </span>
          <span className="productCard__promotion-description">
            {promo.description}
          </span>
        </div>
      ))}
    </>
  );
}
