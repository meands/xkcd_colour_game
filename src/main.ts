import "./style.css";
import { getColourTheme, getRandomColour, increaseCounter } from "./utils.ts";

startRound();

function startRound() {
  const colour = getRandomColour();
  console.log(colour.color);

  const theme = getColourTheme(colour.hex);
  const app = document.querySelector<HTMLDivElement>("#app")!;
  app.style.backgroundColor = colour.hex;

  const targetWords: string[][] = [];
  const words = document.querySelector(".words")!;
  const triesCounter = document.querySelector<HTMLDivElement>(".counter")!;
  triesCounter.style.color = theme === "light" ? "black" : "white";

  const correctCount = correct();
  const total = colour.color.replaceAll(" ", "").length;

  colour.color.split(" ").forEach((word, i) => {
    const chars = word.split("");
    const wordEl = document.createElement("section");
    wordEl.classList.add("word");

    targetWords[i] = [];
    chars.forEach((char, j) => {
      const charEl = document.createElement("input");
      charEl.classList.add(theme);
      setupCharInputListener(
        theme,
        charEl,
        char,
        triesCounter,
        targetWords,
        correctCount,
        total
      );
      targetWords[i][j] = char;
      wordEl.appendChild(charEl);
    });
    words.appendChild(wordEl);
  });

  app.appendChild(words);
  app.appendChild(triesCounter);
}

function nextRound() {
  const app = document.querySelector<HTMLDivElement>("#app")!;
  app.innerHTML = "";
  const words = document.createElement("div");
  words.classList.add("words");
  const counter = document.createElement("div");
  counter.innerText = "Tries: 0";
  counter.classList.add("counter");
  app.appendChild(words);
  app.appendChild(counter);
  startRound();
}

function setupCharInputListener(
  theme: string,
  char: HTMLInputElement,
  answer: string,
  triesCounter: HTMLDivElement,
  targetWords: string[][],
  correct: any,
  total: number
) {
  let prev = "";
  function inputListener(e: Event) {
    if (char.value.length) {
      char.value = (e as InputEvent).data!;
    }
    if (prev === char.value) return;

    if (char.value === answer) {
      char.classList.remove("semiCorrect");
      char.classList.add("correct");
      char.removeEventListener("input", inputListener);
      char.disabled = true;
      correct.increment();

      if (correct.get() === total) {
        const words = document.querySelector(".words");
        words?.classList.add("allCorrect");
        triesCounter.style.visibility = "hidden";
        char?.addEventListener("transitionend", () => {
          const nextRoundBtn = document.createElement("button");
          nextRoundBtn.innerText = "→";
          nextRoundBtn.classList.add("nextButton");
          if (theme === "light") nextRoundBtn.style.filter = "invert(1)";
          nextRoundBtn.addEventListener("click", () => {
            nextRound();
          });
          triesCounter.parentElement?.appendChild(nextRoundBtn);
        });
      } else {
        if (char.nextElementSibling) (char.nextSibling as HTMLElement)?.focus();
        else
          (
            char.parentElement?.nextElementSibling?.firstChild as HTMLElement
          )?.focus();
      }
    } else if (targetWords.find((word) => word.includes(char.value))) {
      char.classList.add("semiCorrect");
      increaseCounter(triesCounter);
    } else {
      char.classList.remove("semiCorrect");
      char.classList.add("incorrect");
      char.addEventListener(
        "animationend",
        function () {
          char.classList.remove("incorrect");
        },
        { once: true }
      );
      increaseCounter(triesCounter);
    }
    prev = char.value;
  }
  char.addEventListener("input", inputListener);
}

function correct() {
  let correct = 0;
  return {
    increment: () => correct++,
    get: () => correct,
  };
}
