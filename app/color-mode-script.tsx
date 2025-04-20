'use client'

import { ColorModeScript } from '@chakra-ui/react'
import { theme } from './providers'

export function ChakraColorModeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            var storageKey = 'chakra-ui-color-mode';
            var classNameDark = 'chakra-ui-dark';
            var classNameLight = 'chakra-ui-light';
            var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

            function setColorMode(mode) {
              var root = document.documentElement;
              root.classList.remove(mode === 'dark' ? classNameLight : classNameDark);
              root.classList.add(mode === 'dark' ? classNameDark : classNameLight);
              localStorage.setItem(storageKey, mode);
            }

            var storedMode = localStorage.getItem(storageKey);
            var mode = storedMode ? storedMode : prefersDark ? 'dark' : 'light';
            setColorMode(mode);
          })();
        `,
      }}
    />
  )
}