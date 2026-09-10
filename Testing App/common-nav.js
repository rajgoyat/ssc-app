(() => {
  const apps = [
    ["english", "English"],
    ["gk", "G.K."],
    ["math", "Math"],
    ["reasoning", "Reasoning"],
  ];
  const current = window.location.pathname.split("/").filter(Boolean)[0] || "home";
  const nav = document.createElement("nav");
  nav.setAttribute("aria-label", "Study apps");
  nav.innerHTML = `
    <style>
      .study-app-switcher { position: fixed; top: 0; left: 0; right: 0; z-index: 10000; display: flex; align-items: center; gap: 6px; min-height: 42px; padding: 6px max(12px, env(safe-area-inset-left)); background: rgba(6, 18, 24, .96); border-bottom: 1px solid rgba(85, 230, 210, .24); box-shadow: 0 5px 20px rgba(0,0,0,.22); backdrop-filter: blur(12px); font: 700 11px/1 monospace; }
      .study-app-switcher a { color: #9bc9c5; text-decoration: none; padding: 8px 10px; border: 1px solid transparent; border-radius: 7px; white-space: nowrap; transition: color .18s ease, background .18s ease, border-color .18s ease; }
      .study-app-switcher a:hover, .study-app-switcher a[aria-current="page"] { color: white; background: transparent; border-color: #55e6d2; }
      .study-app-switcher .hub { margin-right: auto; color: #d4f36b; }
      @media (max-width: 520px) { .study-app-switcher { gap: 2px; overflow-x: auto; } .study-app-switcher a { padding: 8px 7px; font-size: 10px; } }
    </style>
    <div class="study-app-switcher">
      <a class="hub" href="/" aria-label="Study App Hub">HUB</a>
      ${apps.map(([slug, label]) => `<a href="/${slug}/"${current === slug ? ' aria-current="page"' : ""}>${label}</a>`).join("")}
    </div>`;
  document.body.prepend(nav);
  document.body.style.paddingTop = "50px";
})();
