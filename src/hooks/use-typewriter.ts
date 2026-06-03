import { useEffect, useState } from "react";

interface UseTypewriterResult {
  displayText: string;
  isTyping: boolean;
}

export const useTypewriter = (texts: string[], speed = 80, pauseDuration = 1800): UseTypewriterResult => {
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const targetText = texts[textIndex] ?? "";
  const displayText = targetText.slice(0, charIndex);

  useEffect(() => {
    if (!isDeleting && charIndex < targetText.length) {
      const timeout = setTimeout(() => setCharIndex((i) => i + 1), speed);
      return () => clearTimeout(timeout);
    }

    if (!isDeleting && charIndex === targetText.length) {
      const timeout = setTimeout(() => setIsDeleting(true), pauseDuration);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && charIndex > 0) {
      const timeout = setTimeout(() => setCharIndex((i) => i - 1), speed / 2);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setTextIndex((i) => (i + 1) % texts.length);
    }

    return undefined;
  }, [charIndex, isDeleting, targetText, speed, pauseDuration, texts.length]);

  return { displayText, isTyping: !isDeleting };
};
