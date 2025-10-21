export const getTimeBasedGreeting = () => {
  const hour = new Date().getHours();

  // Morning: 5 AM - 11:59 AM
  if (hour >= 5 && hour < 12) {
    return {
      timeOfDay: "morning",
      greetings: [
        "Good morning",
        "Rise and shine",
        "Morning",
        "Top of the morning",
        "Good day ahead",
      ],
      contextMessages: [
        "☕ Time for coffee?",
        "🌅 Fresh start today!",
        "✨ Ready to conquer the day?",
        "🚀 Let's make today count!",
        "💪 Energized for today?",
      ],
    };
  }

  // Afternoon: 12 PM - 4:59 PM
  if (hour >= 12 && hour < 17) {
    return {
      timeOfDay: "afternoon",
      greetings: [
        "Good afternoon",
        "Afternoon",
        "Hello there",
        "Hey",
        "Welcome back",
      ],
      contextMessages: [
        "☀️ Sunny vibes today!",
        "💼 Hope your day is going well!",
        "🎯 Crushing those goals?",
        "⚡ Keep up the momentum!",
        "🌟 You're doing great!",
      ],
    };
  }

  // Evening: 5 PM - 8:59 PM
  if (hour >= 17 && hour < 21) {
    return {
      timeOfDay: "evening",
      greetings: [
        "Good evening",
        "Evening",
        "Welcome back",
        "Hey there",
        "Nice to see you",
      ],
      contextMessages: [
        "🌆 Wrapping up the day?",
        "✅ Time to review progress!",
        "🎉 Almost done for today!",
        "💼 Final stretch!",
        "🌙 Evening productive time!",
      ],
    };
  }

  // Night: 9 PM - 4:59 AM
  return {
    timeOfDay: "night",
    greetings: [
      "Good night",
      "Evening",
      "Welcome back",
      "Burning the midnight oil",
      "Night owl mode",
    ],
    contextMessages: [
      "🌙 Late night hustle?",
      "⭐ Working hard tonight!",
      "🦉 Night shift vibes!",
      "💫 Dedication pays off!",
      "🔥 Impressive commitment!",
    ],
  };
};

export const getWeatherBasedMessage = (
  temperature = null,
  condition = null
) => {
  // If you have weather API integration, use actual data
  // Otherwise, use seasonal estimates

  const month = new Date().getMonth();
  const weatherMessages = [];

  if (temperature !== null) {
    if (temperature < 10) {
      weatherMessages.push("❄️ Bundle up, it's cold!");
      weatherMessages.push("🧥 Stay warm out there!");
    } else if (temperature > 25) {
      weatherMessages.push("☀️ Beautiful weather today!");
      weatherMessages.push("🌞 Enjoy the sunshine!");
    }
  } else {
    // Seasonal messages (Northern Hemisphere)
    if (month >= 11 || month <= 1) {
      weatherMessages.push("❄️ Winter vibes!");
    } else if (month >= 2 && month <= 4) {
      weatherMessages.push("🌸 Spring is here!");
    } else if (month >= 5 && month <= 8) {
      weatherMessages.push("☀️ Summer energy!");
    } else {
      weatherMessages.push("🍂 Autumn feels!");
    }
  }

  return weatherMessages;
};

export const getRecurringUserMessage = (lastLogin = null) => {
  if (!lastLogin) {
    return ["👋 Great to have you here!", "🎉 Welcome aboard!"];
  }

  const now = new Date();
  const last = new Date(lastLogin);
  const daysDiff = Math.floor((now - last) / (1000 * 60 * 60 * 24));

  if (daysDiff === 0) {
    return [
      "👋 Welcome back!",
      "🔄 Back so soon?",
      "✨ Nice to see you again!",
    ];
  } else if (daysDiff === 1) {
    return ["👋 Welcome back!", "🎯 Another productive day!"];
  } else if (daysDiff > 7) {
    return ["🎉 Long time no see!", "👋 Welcome back! We missed you!"];
  }

  return ["👋 Welcome back!", "🌟 Good to see you!"];
};

export const getDynamicGreeting = (
  userName,
  lastLogin = null,
  options = {}
) => {
  const {
    temperature,
    condition,
    showEmoji = true,
    variant = "full",
  } = options;

  const timeData = getTimeBasedGreeting();
  const weatherMessages = getWeatherBasedMessage(temperature, condition);
  const recurringMessages = getRecurringUserMessage(lastLogin);

  // Random selection for variety
  const randomGreeting =
    timeData.greetings[Math.floor(Math.random() * timeData.greetings.length)];
  const randomContext =
    timeData.contextMessages[
      Math.floor(Math.random() * timeData.contextMessages.length)
    ];
  const randomRecurring =
    recurringMessages[Math.floor(Math.random() * recurringMessages.length)];
  const randomWeather =
    weatherMessages.length > 0
      ? weatherMessages[Math.floor(Math.random() * weatherMessages.length)]
      : null;

  if (variant === "simple") {
    return {
      greeting: randomGreeting,
      userName: userName || "User",
      timeOfDay: timeData.timeOfDay,
    };
  }

  if (variant === "medium") {
    return {
      greeting: randomGreeting,
      userName: userName || "User",
      context: randomContext,
      timeOfDay: timeData.timeOfDay,
    };
  }

  // Full variant
  return {
    greeting: randomGreeting,
    userName: userName || "User",
    context: randomContext,
    recurring: randomRecurring,
    weather: randomWeather,
    timeOfDay: timeData.timeOfDay,
  };
};

// React Hook for greeting
export const useGreeting = (userName, lastLogin = null, options = {}) => {
  const [greeting, setGreeting] = React.useState(() =>
    getDynamicGreeting(userName, lastLogin, options)
  );

  React.useEffect(() => {
    // Update greeting every minute to keep it fresh
    const interval = setInterval(() => {
      setGreeting(getDynamicGreeting(userName, lastLogin, options));
    }, 60000);

    return () => clearInterval(interval);
  }, [userName, lastLogin, options]);

  return greeting;
};
