import productImage from "./images/produ1.avif";
import productImage1 from "./images/produ2.avif";
import "./styles/exclusiveDeal.css";
import WelcomeDeal from "./exclusiveDeal/WelcomeDeal";
import FirstComers from "./exclusiveDeal/FirstComers";
import BuyFrom10k from "./exclusiveDeal/BuyFrom10k";

export default function ExclusiveDeal({
  user,
  selectedCurrency,
  conversionRate,
}) {
  return (
    <section className="exclusiveDeal-main">
      <WelcomeDeal
        productImage={productImage}
        conversionRate={conversionRate}
        selectedCurrency={selectedCurrency}
        user={user}
      />
      <FirstComers
        productImage={productImage}
        productImage1={productImage1}
        conversionRate={conversionRate}
        selectedCurrency={selectedCurrency}
      />
      <BuyFrom10k
        productImage={productImage}
        productImage1={productImage1}
        conversionRate={conversionRate}
        selectedCurrency={selectedCurrency}
      />
    </section>
  );
}
