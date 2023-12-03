/*
Here in this file, we mentioned the files where tailwind needs to be integrated in content (All page types).
In the extend property, we mention the css properties which tailwind doesn't provide implicitly.
We can also use this to override any of the tailwind's utility classes.
For responsiveness, we should use prefixes like 'sm, md, lg, xl' with our tailwind utility classes (for max-width),
we should use prefixes like 'min-sm, min-md, min-lg, min-xl' for min-width mediaquery rules.
*/

/*NOTE: To use tailwind's native className prop, we need to have the following two import statements in the same order:
import tw from "twin.macro"
import 'styled-components/macro'
Same goes for using twin.macro's tw and css prop (instead of tailwind's className, tw prop can be used inside JSX 
and css prop is for writing conditional css inside JSX) -- We need to import the above 2 statements
For more details: https://github.com/ben-rogerson/twin.examples/blob/master/cra-styled-components/README.md
*/
/* eslint-disable @typescript-eslint/no-var-requires */
const config = require('./tailwindConfig')
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx,less}', './index.html'],
  //purge: ['./src/**/*.{js,jsx,ts,tsx,less}', './index.html'],
  darkMode: 'class', //To enable dark mode using tailwind - using dark:classname
  theme: {
    extend: {
      ...config
    }
  },
  plugins: []
}
