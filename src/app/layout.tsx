"use client";

import { AppContext } from "@/app/context";
import "@/app/globals.css";
import { initialState, reducer } from "@/app/reducer";
import { Source_Sans_3 } from "next/font/google";
import Script from "next/script";
import { ReactNode, useReducer } from "react";

const sourceSource_Sans_3 = Source_Sans_3({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const appContext = {
    dispatch,
    state,
  };

  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(){"use strict";!function(e,t){var n=e.amplitude||{_q:[],_iq:{}};if(n.invoked)e.console&&console.error&&console.error("Amplitude snippet has been loaded.");else{var r=function(e,t){e.prototype[t]=function(){return this._q.push({name:t,args:Array.prototype.slice.call(arguments,0)}),this}},s=function(e,t,n){return function(r){e._q.push({name:t,args:Array.prototype.slice.call(n,0),resolve:r})}},o=function(e,t,n){e[t]=function(){if(n)return{promise:new Promise(s(e,t,Array.prototype.slice.call(arguments)))}}},i=function(e){for(var t=0;t<m.length;t++)o(e,m[t],!1);for(var n=0;n<g.length;n++)o(e,g[n],!0)};n.invoked=!0;var u=t.createElement("script");u.type="text/javascript",u.integrity="sha384-x0ik2D45ZDEEEpYpEuDpmj05fY91P7EOZkgdKmq4dKL/ZAVcufJ+nULFtGn0HIZE",u.crossOrigin="anonymous",u.async=!0,u.src="https://cdn.amplitude.com/libs/analytics-browser-2.0.0-min.js.gz",u.onload=function(){e.amplitude.runQueuedFunctions||console.log("[Amplitude] Error: could not load SDK")};var a=t.getElementsByTagName("script")[0];a.parentNode.insertBefore(u,a);for(var c=function(){return this._q=[],this},p=["add","append","clearAll","prepend","set","setOnce","unset","preInsert","postInsert","remove","getUserProperties"],l=0;l<p.length;l++)r(c,p[l]);n.Identify=c;for(var d=function(){return this._q=[],this},f=["getEventProperties","setProductId","setQuantity","setPrice","setRevenue","setRevenueType","setEventProperties"],v=0;v<f.length;v++)r(d,f[v]);n.Revenue=d;var m=["getDeviceId","setDeviceId","getSessionId","setSessionId","getUserId","setUserId","setOptOut","setTransport","reset","extendSession"],g=["init","add","remove","track","logEvent","identify","groupIdentify","setGroup","revenue","flush"];i(n),n.createInstance=function(e){return n._iq[e]={_q:[]},i(n._iq[e]),n._iq[e]},e.amplitude=n}}(window,document)}();amplitude.init('c0c9fdd7ecdfada73449a0517426b056');`,
          }}
        />

        <Script
          crossOrigin="anonymous"
          src="https://kit.fontawesome.com/401fb1e734.js"
        />
      </head>

      <body className={sourceSource_Sans_3.className}>
        <AppContext.Provider value={appContext}>{children}</AppContext.Provider>
      </body>
    </html>
  );
}
