import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

interface LogoProps extends Omit<ComponentProps<'svg'>, 'children'> {}

export function Logo({ className, ...otherProps }: LogoProps) {
  return (
    <svg
      className={twMerge(``, className)}
      width="403"
      height="326"
      viewBox="0 0 403 326"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...otherProps}
    >
      <ellipse
        opacity="0.5"
        cx="196"
        cy="158"
        rx="159"
        ry="158"
        className="fill-secondaryColor-400"
      />
      <path
        d="M291.414 213.363V1.96735L392.121 106.946L291.414 213.363Z"
        className="fill-secondaryColor-400"
      />
      <path
        d="M111.698 272.131V325.996L10.9914 219.579L111.698 114.6V167.449H379.233L402.121 272.131H111.698Z"
        className="fill-secondaryColor-400"
      />
      <path
        d="M101.698 261.131V314.996L0.991364 208.579L101.698 103.6V156.449H369.233L392.121 261.131H101.698Z"
        className="fill-primaryColor-500"
      />
      <path
        d="M70.5494 247.695C70.2859 240.232 70.1542 231.282 70.1542 220.846C70.1542 210.344 70.4835 196.341 71.1422 178.838C76.6749 176.79 82.3394 175.767 88.1356 175.767C93.9977 175.767 99.2012 177.946 103.746 182.306C108.357 186.599 110.662 192.048 110.662 198.653C110.662 205.192 108.159 210.872 103.153 215.694C98.2132 220.45 91.7253 223.95 83.6897 226.196C83.6897 233.594 83.7885 241.189 83.9861 248.983L70.5494 247.695ZM93.4708 208.66C95.9079 205.819 97.1264 202.649 97.1264 199.148C97.1264 195.648 96.2043 192.808 94.36 190.628C92.5816 188.448 90.5727 187.358 88.3332 187.358C87.7404 187.358 86.3902 187.524 84.2825 187.854C83.9531 197.167 83.7555 206.183 83.6897 214.901C87.8392 213.58 91.0996 211.5 93.4708 208.66Z"
        className="fill-secondaryColor-400"
      />
      <path
        d="M129.517 196.374L129.616 207.768L144.436 206.876C144.436 196.572 144.6 185.641 144.93 174.082L157.971 175.271C157.379 185.773 157.082 197.167 157.082 209.452C157.082 221.671 157.444 233.957 158.169 246.308L145.523 245.218C144.93 239.538 144.568 230.423 144.436 217.874L129.912 218.765C130.11 228.144 130.406 237.689 130.801 247.398L117.365 246.209C116.64 232.273 116.278 219.459 116.278 207.768C116.278 196.077 116.541 185.971 117.068 177.451L130.11 178.64C129.715 184.518 129.517 190.43 129.517 196.374Z"
        className="fill-secondaryColor-400"
      />
      <path
        d="M169.043 246.903C169.899 231.051 170.327 216.916 170.327 204.498C170.327 192.081 170.294 183.924 170.229 180.027C177.474 176.592 185.016 174.875 192.854 174.875C198.65 174.875 203.491 176.724 207.377 180.423C211.329 184.122 213.305 189.34 213.305 196.077C213.305 203.871 207.805 211.368 196.806 218.567C202.799 226.097 208.925 234.386 215.182 243.435L205.698 250.469C201.548 244.195 194.105 233.957 183.369 219.756C183.171 229.928 182.875 239.472 182.48 248.389L169.043 246.903ZM183.665 213.019C188.539 210.707 192.689 207.867 196.114 204.498C199.539 201.064 201.252 197.959 201.252 195.185C201.252 192.411 200.428 190.265 198.782 188.745C197.201 187.226 195.093 186.467 192.458 186.467C189.824 186.467 186.926 187.028 183.764 188.151C183.764 199.313 183.731 207.603 183.665 213.019Z"
        className="fill-secondaryColor-400"
      />
      <path
        d="M249.702 245.02L247.429 231.249L232.708 231.843L228.954 250.469L215.122 249.28L232.807 177.451L251.085 179.036L264.028 246.209L249.702 245.02ZM241.007 190.43L234.783 221.242L245.849 220.846L241.007 190.43Z"
        className="fill-secondaryColor-400"
      />
      <path
        d="M295.606 202.715C296.463 199.479 296.891 196.771 296.891 194.591C296.891 192.411 296.298 190.628 295.112 189.241C293.927 187.788 292.379 187.061 290.469 187.061C288.625 187.061 287.077 187.986 285.825 189.835C284.574 191.685 283.948 193.798 283.948 196.176C283.948 200.8 286.583 204.763 291.852 208.065C297.121 211.5 300.711 213.977 302.621 215.496C304.531 217.015 305.882 218.402 306.672 219.657C308.648 222.893 309.636 226.229 309.636 229.664C309.636 235.608 307.627 240.364 303.609 243.93C299.657 247.431 295.178 249.181 290.172 249.181C284.244 249.181 279.272 246.672 275.254 241.652C272.356 238.019 269.688 233.494 267.251 228.078L276.835 223.422C278.349 227.385 280.227 230.753 282.466 233.527C284.771 236.236 287.208 237.59 289.777 237.59C291.424 237.59 292.906 237.061 294.223 236.004C295.541 234.948 296.199 233.362 296.199 231.249C296.199 229.069 295.376 227.055 293.729 225.205C292.083 223.356 289.876 221.473 287.11 219.558C284.343 217.642 282.203 216.09 280.688 214.901C279.173 213.646 277.493 212.061 275.649 210.146C272.158 206.447 270.413 201.724 270.413 195.978C270.413 190.166 272.422 185.311 276.439 181.414C280.457 177.451 285.232 175.469 290.765 175.469C296.298 175.469 300.942 177.616 304.696 181.909C308.516 186.202 310.426 190.628 310.426 195.185C310.426 199.677 309.57 203.541 307.858 206.777L295.606 202.715Z"
        className="fill-secondaryColor-400"
      />
      <path
        d="M320.07 246.407C319.807 235.971 319.675 226.097 319.675 216.784C319.675 207.471 320.202 195.35 321.256 180.423C332.519 178.706 343.518 177.847 354.255 177.847V190.033C346.812 190.033 339.896 190.265 333.507 190.727C333.243 198.125 333.079 203.805 333.013 207.768C338.019 207.041 343.947 206.612 350.797 206.48L352.674 217.378C348.261 217.444 341.641 217.94 332.815 218.864C332.815 226.79 332.848 232.504 332.914 236.004C338.644 235.542 345.494 234.551 353.464 233.032L355.144 243.93C349.545 246.506 342.926 247.794 335.285 247.794L320.07 246.407Z"
        className="fill-secondaryColor-400"
      />
      <path
        d="M67.5494 244.695C67.2859 237.232 67.1542 228.282 67.1542 217.846C67.1542 207.344 67.4835 193.341 68.1422 175.838C73.6749 173.79 79.3394 172.767 85.1356 172.767C90.9977 172.767 96.2012 174.946 100.746 179.306C105.357 183.599 107.662 189.048 107.662 195.653C107.662 202.192 105.159 207.872 100.153 212.694C95.2132 217.45 88.7253 220.95 80.6897 223.196C80.6897 230.594 80.7885 238.189 80.9861 245.983L67.5494 244.695ZM90.4708 205.66C92.9079 202.819 94.1264 199.649 94.1264 196.148C94.1264 192.648 93.2043 189.808 91.36 187.628C89.5816 185.448 87.5727 184.358 85.3332 184.358C84.7404 184.358 83.3902 184.524 81.2825 184.854C80.9531 194.167 80.7555 203.183 80.6897 211.901C84.8392 210.58 88.0996 208.5 90.4708 205.66Z"
        fill="white"
      />
      <path
        d="M126.517 193.374L126.616 204.768L141.436 203.876C141.436 193.572 141.6 182.641 141.93 171.082L154.971 172.271C154.379 182.773 154.082 194.167 154.082 206.452C154.082 218.671 154.444 230.957 155.169 243.308L142.523 242.218C141.93 236.538 141.568 227.423 141.436 214.874L126.912 215.765C127.11 225.144 127.406 234.689 127.801 244.398L114.365 243.209C113.64 229.273 113.278 216.459 113.278 204.768C113.278 193.077 113.541 182.971 114.068 174.451L127.11 175.64C126.715 181.518 126.517 187.43 126.517 193.374Z"
        fill="white"
      />
      <path
        d="M166.043 243.903C166.899 228.051 167.327 213.916 167.327 201.498C167.327 189.081 167.294 180.924 167.229 177.027C174.474 173.592 182.016 171.875 189.854 171.875C195.65 171.875 200.491 173.724 204.377 177.423C208.329 181.122 210.305 186.34 210.305 193.077C210.305 200.871 204.805 208.368 193.806 215.567C199.799 223.097 205.925 231.386 212.182 240.435L202.698 247.469C198.548 241.195 191.105 230.957 180.369 216.756C180.171 226.928 179.875 236.472 179.48 245.389L166.043 243.903ZM180.665 210.019C185.539 207.707 189.689 204.867 193.114 201.498C196.539 198.064 198.252 194.959 198.252 192.185C198.252 189.411 197.428 187.265 195.782 185.745C194.201 184.226 192.093 183.467 189.458 183.467C186.824 183.467 183.926 184.028 180.764 185.151C180.764 196.313 180.731 204.603 180.665 210.019Z"
        fill="white"
      />
      <path
        d="M246.702 242.02L244.429 228.249L229.708 228.843L225.954 247.469L212.122 246.28L229.807 174.451L248.085 176.036L261.028 243.209L246.702 242.02ZM238.007 187.43L231.783 218.242L242.849 217.846L238.007 187.43Z"
        fill="white"
      />
      <path
        d="M292.606 199.715C293.463 196.479 293.891 193.771 293.891 191.591C293.891 189.411 293.298 187.628 292.112 186.241C290.927 184.788 289.379 184.061 287.469 184.061C285.625 184.061 284.077 184.986 282.825 186.835C281.574 188.685 280.948 190.798 280.948 193.176C280.948 197.8 283.583 201.763 288.852 205.065C294.121 208.5 297.711 210.977 299.621 212.496C301.531 214.015 302.882 215.402 303.672 216.657C305.648 219.893 306.636 223.229 306.636 226.664C306.636 232.608 304.627 237.364 300.609 240.93C296.657 244.431 292.178 246.181 287.172 246.181C281.244 246.181 276.272 243.672 272.254 238.652C269.356 235.019 266.688 230.494 264.251 225.078L273.835 220.422C275.349 224.385 277.227 227.753 279.466 230.527C281.771 233.236 284.208 234.59 286.777 234.59C288.424 234.59 289.906 234.061 291.223 233.004C292.541 231.948 293.199 230.362 293.199 228.249C293.199 226.069 292.376 224.055 290.729 222.205C289.083 220.356 286.876 218.473 284.11 216.558C281.343 214.642 279.203 213.09 277.688 211.901C276.173 210.646 274.493 209.061 272.649 207.146C269.158 203.447 267.413 198.724 267.413 192.978C267.413 187.166 269.422 182.311 273.439 178.414C277.457 174.451 282.232 172.469 287.765 172.469C293.298 172.469 297.942 174.616 301.696 178.909C305.516 183.202 307.426 187.628 307.426 192.185C307.426 196.677 306.57 200.541 304.858 203.777L292.606 199.715Z"
        fill="white"
      />
      <path
        d="M317.07 243.407C316.807 232.971 316.675 223.097 316.675 213.784C316.675 204.471 317.202 192.35 318.256 177.423C329.519 175.706 340.518 174.847 351.255 174.847V187.033C343.812 187.033 336.896 187.265 330.507 187.727C330.243 195.125 330.079 200.805 330.013 204.768C335.019 204.041 340.947 203.612 347.797 203.48L349.674 214.378C345.261 214.444 338.641 214.94 329.815 215.864C329.815 223.79 329.848 229.504 329.914 233.004C335.644 232.542 342.494 231.551 350.464 230.032L352.144 240.93C346.545 243.506 339.926 244.794 332.285 244.794L317.07 243.407Z"
        fill="white"
      />
      <path
        d="M44.2241 54.8163H315.828L345.836 156.449L21.3362 159.498L44.2241 54.8163Z"
        className="fill-secondaryColor-400"
      />
      <path
        d="M193.054 69.6237L193.157 117.3C193.157 125.161 192.883 133.602 192.336 142.625L180.845 141.497C172.023 121.469 164.807 106.466 159.198 96.4864C159.267 106.603 159.301 122.734 159.301 144.88L147.298 143.547C147.093 139.31 146.99 135.208 146.99 131.244C146.99 114.703 147.913 95.427 149.76 73.4173L163.405 74.7502C170.176 93.4106 176.263 107.594 181.666 117.3C181.256 96.6573 180.777 80.3893 180.23 68.4959L193.054 69.6237Z"
        fill="white"
      />
      <path
        d="M205.257 142.215C204.983 131.415 204.846 121.196 204.846 111.558C204.846 101.921 205.394 89.3777 206.488 73.93C218.183 72.1528 229.605 71.2642 240.754 71.2642V83.8753C233.025 83.8753 225.844 84.1146 219.209 84.593C218.936 92.2486 218.765 98.1269 218.696 102.228C223.894 101.476 230.05 101.032 237.163 100.895L239.112 112.173C234.53 112.242 227.656 112.754 218.491 113.711C218.491 121.914 218.525 127.826 218.594 131.449C224.544 130.971 231.657 129.945 239.933 128.373L241.677 139.651C235.864 142.317 228.99 143.65 221.056 143.65L205.257 142.215Z"
        fill="white"
      />
      <path
        d="M245.808 138.216C250.185 127.485 254.973 117.197 260.171 107.355C254.768 95.1877 250.903 83.8753 248.578 73.4173L262.838 74.6477C263.522 79.7058 265.232 87.1563 267.968 96.9991C272.482 87.8398 277.338 78.8514 282.536 70.0338L292.488 78.5438C286.811 87.0196 280.929 96.9991 274.842 108.482C278.74 117.983 283.733 129.364 289.82 142.625L275.97 141.189C273.303 135.106 270.43 127.792 267.352 119.248C261.949 130.868 258.359 139.412 256.58 144.88L245.808 138.216Z"
        fill="white"
      />
      <path
        d="M305.813 142.01C305.129 129.911 304.787 119.385 304.787 110.43C304.787 101.408 304.993 92.0093 305.403 82.2349L292.887 83.9779L290.63 72.0844C297.332 70.9224 303.967 70.068 310.533 69.5212L329.717 68.4959L331.667 79.8767C327.905 80.0817 323.664 80.3893 318.945 80.7994C318.535 90.6423 318.33 99.6649 318.33 107.867C318.33 116.07 318.466 127.826 318.74 143.137L305.813 142.01Z"
        fill="white"
      />
      <path
        d="M136.255 75.4932C132.507 85.6413 128.653 97.1865 124.694 110.129C120.735 123.072 117.55 135 115.141 145.915L102.256 140.691C105.485 127.097 108.74 114.939 112.019 104.219C115.319 93.4338 119.102 82.1173 123.37 70.2698L136.255 75.4932Z"
        className="fill-primaryColor-500"
      />
      <path
        d="M101.065 73.3345C97.6111 83.5725 93.9045 95.1627 89.9451 108.105C85.9858 121.048 82.5889 132.911 79.7545 143.696L73.4933 140.496C77.1476 127.032 80.6144 114.939 83.8939 104.219C87.1934 93.4338 90.8299 82.0724 94.8036 70.1349L101.065 73.3345Z"
        className="fill-primaryColor-500"
      />
      <path
        d="M73.0377 72.2556C69.7311 82.5385 66.0981 94.1512 62.1388 107.094C58.1794 120.036 54.6763 131.867 51.6293 142.587L48.6787 140.399C52.5455 126.999 56.1186 114.939 59.3981 104.219C62.6976 93.4338 66.2606 82.0499 70.0871 70.0674L73.0377 72.2556Z"
        className="fill-primaryColor-500"
      />
    </svg>
  )
}