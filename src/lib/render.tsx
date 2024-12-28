import React from 'react';
import * as Babel from '@babel/standalone';
// import { transform } from '@babel/core';

// export const testJsx = `import { CircleAlert } from 'lucide-react';

// const LoginForm = () => {
//   return (
//     <div className="min-h-screen bg-white flex items-center justify-center">
//       <div className="bg-[#f0f9ff] p-8 rounded-lg w-[400px]">
//         <h1 className="text-gray-600 text-2xl font-medium text-center mb-6">LOG IN</h1>
//         <CircleAlert />
//         <form className="space-y-6">
//           <div className="space-y-2">
//             <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//               E-mail address
//             </label>
//             <input
//               type="email"
//               id="email"
//               className="w-full px-4 py-3 rounded border border-[#E0E0E0] placeholder-[#757575]"
//               placeholder="Enter your email"
//             />
//           </div>

//           <div className="space-y-2">
//             <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//               Password
//             </label>
//             <input
//               type="password"
//               id="password"
//               className="w-full px-4 py-3 rounded border border-[#E0E0E0] placeholder-[#757575]"
//               placeholder="Enter your password"
//             />
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600 transition-colors"
//           >
//             LOG IN
//           </button>

//           <button
//             type="button"
//             className="w-full border border-blue-500 text-blue-500 py-3 rounded hover:bg-blue-50 transition-colors"
//           >
//             SIGN UP
//           </button>

//           <button
//             type="button"
//             className="w-full text-blue-500 py-3 rounded hover:bg-blue-50 transition-colors"
//           >
//             FORGOT PASSWORD?
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };`;

export const testJsx = `
    import { Home, AlertCircle } from "lucide-react";

    const IconComponent = () => (
      <div>
        <h1>Dynamic Icons</h1>
        <div style={{ fontSize: '24px', display: 'flex', gap: '10px' }}>
          <Home />
          <AlertCircle />
        </div>
      </div>
    );

    export { IconComponent };
  `;

// Supported icon libraries
const iconLibraries = {
  // TODO: Add react-icons support (currently not working)
  // reactIcons: {
  // fa: require('react-icons/fa'),
  // md: require('react-icons/md'),
  // ai: require('react-icons/ai'),
  // ci: require('react-icons/ci'),
  // Add more react-icons sub-libraries as needed
  // },
  lucide: require('lucide-react'),
};

function cleanImports(rawJsx: string) {
  // Removes `import React from 'react';` or similar variations
  return rawJsx.replace(
    /^\s*import\s+React\s+from\s+['"]react['"];?\s*$/gm,
    '',
  );
}

// Transform raw JSX into dynamically resolved imports
export function transformJsx(rawJsx: string) {
  rawJsx = cleanImports(rawJsx);

  // if (!rawJsx.includes('export default')) {
  //   rawJsx = `${rawJsx}\nexport default IconComponent;`;
  // }

  rawJsx = rawJsx.replace(
    /import\s+{([^}]+)}\s+from\s+['"](react-icons\/(\w+)|lucide-react)['"];/g,
    (_, icons, library, reactIconsSubLib) => {
      return icons
        .split(',')
        .map((icon: string) => {
          const iconName = icon.trim();
          if (library === 'lucide-react') {
            return `const ${iconName} = iconLibraries.lucide['${iconName}'];`;
          }
          return `const ${iconName} = iconLibraries.reactIcons['${reactIconsSubLib}']['${iconName}'];`;
        })
        .join('\n');
    },
  );

  return rawJsx;
}

// Evaluate the transformed JSX code
export function evaluateReactCode(rawJsx: string) {
  const transformedJsx = transformJsx(rawJsx);

  const imports = { React, iconLibraries };

  const result = Babel.transform(transformedJsx, {
    presets: ['react'],
  });

  if (!result) {
    throw new Error('Failed to transform JSX');
  }

  const code = result.code;

  const fn = new Function(
    ...Object.keys(imports),
    `
    let exports = {};
    let module = { exports };
    ${code};
    return module.exports.default || exports.default;
  `,
  );

  const component = fn(...Object.values(imports));

  if (!component) {
    throw new Error('No React component found in the evaluated code');
  }

  return component;
}

export function evaluateHtmlCode(rawHtml: string) {
  return rawHtml;
}

//Create a method that takes a React code as a string and returns only the JSX part of the code
export function extractJsx(rawJsx: string) {
  // First, try to find the component's return statement
  const returnMatch = rawJsx.match(/return\s*\(([\s\S]*?)\);/);
  if (returnMatch) {
    return returnMatch[1].trim();
  }

  // If no return statement, look for JSX between arrow function or render method
  const arrowMatch = rawJsx.match(/=>\s*\(([\s\S]*?)\);/);
  if (arrowMatch) {
    return arrowMatch[1].trim();
  }

  // As a fallback, try to find any JSX-like structure
  const jsxMatch = rawJsx.match(/<[\w\s]*>[\s\S]*?<\/[\w]*>/);
  return jsxMatch ? jsxMatch[0] : null;
}
