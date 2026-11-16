"use client";

import { useEffect } from "react";

const REVEAL_SELECTOR = "[data-reveal], [data-reveal-stagger]";

export function MotionProvider() {
  useEffect(() => {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion || !("IntersectionObserver" in window)) {
      root.classList.add("motion-disabled");
      document.querySelectorAll(REVEAL_SELECTOR).forEach((element) => {
        element.classList.add("is-visible");
      });
      return;
    }

    root.classList.add("motion-ready");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: "0px 0px -9% 0px",
        threshold: 0.12,
      },
    );

    const observeNewElements = (scope: ParentNode = document) => {
      scope.querySelectorAll(REVEAL_SELECTOR).forEach((element) => {
        if (
          !element.classList.contains("is-visible") &&
          !element.hasAttribute("data-motion-observed")
        ) {
          element.setAttribute("data-motion-observed", "true");
          observer.observe(element);
        }
      });
    };

    observeNewElements();

    const mutations = new MutationObserver((records) => {
      records.forEach((record) => {
        record.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          if (node.matches(REVEAL_SELECTOR)) {
            node.setAttribute("data-motion-observed", "true");
            observer.observe(node);
          }
          observeNewElements(node);
        });
      });
    });

    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutations.disconnect();
      root.classList.remove("motion-ready");
    };
  }, []);

  return null;
}
