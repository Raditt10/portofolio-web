import React, { useEffect, useMemo, useState } from "react";

import { GITHUB_PROFILE_URL, GITHUB_USERNAME } from "../../constant";

const GitHubContributions = () => {
  const [themeMode, setThemeMode] = useState("dark");
  const isLight = themeMode === "light";

  const [contribDays, setContribDays] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const updateTheme = () => {
      setThemeMode(document.documentElement.getAttribute("data-theme") || "dark");
    };
    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  const username = (GITHUB_USERNAME || "").trim();
  const profileUrl = (GITHUB_PROFILE_URL || (username ? `https://github.com/${username}` : "")).trim();

  const chartUrl = useMemo(() => {
    if (!username) return "";
    // Third-party SVG renderer for GitHub contribution heatmap.
    // Keeps markup light (no extra deps) and matches the “GitHub graph” visual.
    return `https://ghchart.rshah.org/${encodeURIComponent(username)}`;
  }, [username]);

  useEffect(() => {
    if (!username) return;
    let cancelled = false;
    setLoading(true);
    setLoadError(false);

    const url = `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=last`;
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        const days = Array.isArray(data?.contributions)
          ? data.contributions
          : Array.isArray(data?.contributions?.days)
            ? data.contributions.days
            : Array.isArray(data?.days)
              ? data.days
              : null;
        if (!days) throw new Error("Unexpected payload");
        setContribDays(days);
      })
      .catch(() => {
        if (cancelled) return;
        setLoadError(true);
        setContribDays(null);
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [username]);

  const calendar = useMemo(() => {
    if (!Array.isArray(contribDays) || contribDays.length === 0) return null;

    const normalized = contribDays
      .map((d) => {
        const date = d?.date || d?.day || d?.created_at;
        const count = typeof d?.count === "number" ? d.count : typeof d?.contributionCount === "number" ? d.contributionCount : d?.contributions;
        return {
          date: typeof date === "string" ? date.slice(0, 10) : null,
          count: typeof count === "number" ? count : 0,
        };
      })
      .filter((d) => Boolean(d.date));

    if (normalized.length === 0) return null;

    const byDate = new Map(normalized.map((d) => [d.date, d.count]));
    const dates = normalized.map((d) => d.date).sort();
    const minDate = new Date(`${dates[0]}T00:00:00`);
    const maxDate = new Date(`${dates[dates.length - 1]}T00:00:00`);

    const start = new Date(minDate);
    start.setDate(start.getDate() - start.getDay()); // Sunday
    const end = new Date(maxDate);
    end.setDate(end.getDate() + (6 - end.getDay()));

    const weeks = [];
    const monthMarkers = [];
    let cursor = new Date(start);
    let prevMonth = null;
    while (cursor <= end) {
      const weekStart = new Date(cursor);
      const week = [];
      for (let i = 0; i < 7; i += 1) {
        const d = new Date(weekStart);
        d.setDate(weekStart.getDate() + i);
        const key = d.toISOString().slice(0, 10);
        const inRange = d >= minDate && d <= maxDate;
        week.push({
          date: key,
          count: byDate.get(key) ?? 0,
          inRange,
        });
      }
      weeks.push(week);

      const month = weekStart.getMonth();
      if (prevMonth === null) {
        prevMonth = month;
      } else if (month !== prevMonth && weekStart.getDate() <= 7) {
        monthMarkers.push({
          index: weeks.length - 1,
          label: weekStart.toLocaleString("en-US", { month: "short" }),
        });
        prevMonth = month;
      }

      cursor.setDate(cursor.getDate() + 7);
    }

    // Ensure first marker exists
    if (weeks.length > 0) {
      const firstWeekStart = new Date(`${weeks[0][0].date}T00:00:00`);
      monthMarkers.unshift({
        index: 0,
        label: firstWeekStart.toLocaleString("en-US", { month: "short" }),
      });
    }

    return {
      weeks,
      monthMarkers,
    };
  }, [contribDays]);

  const getLevel = (count) => {
    if (!count || count <= 0) return 0;
    if (count <= 3) return 1;
    if (count <= 7) return 2;
    if (count <= 15) return 3;
    return 4;
  };

  return (
    <section
      id="github"
      className="relative py-24 sm:py-32 px-4 sm:px-6 overflow-hidden font-sans"
    >
      {/* --- BACKGROUND (Clean Monochrome) --- */}
      <div className="absolute inset-0 -z-20 overflow-hidden pointer-events-none">
        <div className={`absolute inset-0 transition-colors duration-700 ${isLight ? "bg-white" : "bg-black"}`} />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `linear-gradient(${isLight ? "#000" : "#fff"} 1px, transparent 1px), linear-gradient(90deg, ${isLight ? "#000" : "#fff"} 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4 font-heading">
            <span
              className={`bg-clip-text text-transparent ${
                isLight
                  ? "bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500"
                  : "bg-gradient-to-r from-white via-gray-200 to-gray-500"
              }`}
            >
              GitHub Contributions
            </span>
          </h1>
          <div className={`h-1 w-24 rounded-full ${isLight ? "bg-black" : "bg-white"} mx-auto`} />
        </div>

        <div
          className={`mx-auto max-w-5xl rounded-3xl border backdrop-blur-md overflow-hidden ${
            isLight ? "bg-white/70 border-gray-200" : "bg-white/5 border-white/10"
          }`}
        >
          <div className="px-6 sm:px-10 py-6 sm:py-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <div>
                <h2 className={`text-xl sm:text-2xl font-bold ${isLight ? "text-black" : "text-white"}`}>
                  {username ? `@${username}` : "GitHub"}
                </h2>
                <p className={`${isLight ? "text-gray-600" : "text-gray-400"} text-sm`}>
                  Daily contribution heatmap
                </p>
              </div>
            </div>

            {chartUrl ? (
              <div>
                {/* Modern calendar (preferred) */}
                {calendar && !loadError ? (
                  <div
                    className={`rounded-2xl border overflow-hidden ${
                      isLight ? "bg-white/60 border-gray-200" : "bg-black/20 border-white/10"
                    }`}
                    style={{
                      // shared sizing for month markers
                      "--cell": "11px",
                      "--gap": "3px",
                    }}
                  >
                    <div className="w-full overflow-x-auto">
                      <div className="min-w-[860px] px-5 sm:px-6 py-5 sm:py-6">
                        {/* Month labels */}
                        <div className="flex items-start gap-3 mb-3">
                          <div className={`w-10 shrink-0 text-[11px] ${isLight ? "text-gray-500" : "text-gray-500"}`}>
                            <span className="sr-only">Weekdays</span>
                          </div>
                          <div className="relative flex-1 h-4">
                            {calendar.monthMarkers.map((m) => (
                              <span
                                key={`${m.label}-${m.index}`}
                                className={`absolute top-0 text-[11px] ${isLight ? "text-gray-500" : "text-gray-500"}`}
                                style={{ left: `calc(${m.index} * (var(--cell) + var(--gap)))` }}
                              >
                                {m.label}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          {/* Day labels (Mon/Wed/Fri) */}
                          <div className={`w-10 shrink-0 grid grid-rows-7 gap-[var(--gap)] text-[11px] ${isLight ? "text-gray-500" : "text-gray-500"}`}>
                            <span className="row-start-2">Mon</span>
                            <span className="row-start-4">Wed</span>
                            <span className="row-start-6">Fri</span>
                          </div>

                          {/* Calendar grid */}
                          <div className="flex gap-[var(--gap)]">
                            {calendar.weeks.map((week, wi) => (
                              <div key={wi} className="flex flex-col gap-[var(--gap)]">
                                {week.map((day) => {
                                  const level = getLevel(day.count);
                                  const base = day.inRange ? "" : "opacity-30";
                                  const color = isLight
                                    ? [
                                        "bg-gray-200/70",
                                        "bg-emerald-200",
                                        "bg-emerald-300",
                                        "bg-emerald-500",
                                        "bg-emerald-700",
                                      ][level]
                                    : [
                                        "bg-white/10",
                                        "bg-emerald-950/60",
                                        "bg-emerald-900",
                                        "bg-emerald-700",
                                        "bg-emerald-500",
                                      ][level];

                                  return (
                                    <div
                                      key={day.date}
                                      className={`h-[var(--cell)] w-[var(--cell)] rounded-[3px] ${color} ${base}`}
                                      aria-label={`${day.date}: ${day.count} contributions`}
                                      title={`${day.date}: ${day.count} contributions`}
                                    />
                                  );
                                })}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}

                {/* Loading skeleton */}
                {loading ? (
                  <div
                    className={`rounded-2xl border overflow-hidden animate-pulse ${
                      isLight ? "bg-white/60 border-gray-200" : "bg-black/20 border-white/10"
                    }`}
                  >
                    <div className="w-full overflow-x-auto">
                      <div className="min-w-[860px] px-5 sm:px-6 py-5 sm:py-6">
                        <div className={`h-4 w-56 rounded ${isLight ? "bg-gray-200" : "bg-white/10"}`} />
                        <div className="mt-4 flex gap-3">
                          <div className={`w-10 h-[110px] rounded ${isLight ? "bg-gray-200" : "bg-white/10"}`} />
                          <div className={`h-[110px] w-[780px] rounded ${isLight ? "bg-gray-200" : "bg-white/10"}`} />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}

                {/* Fallback image (if API blocked/failed) */}
                {!calendar || loadError ? (
                  <div className="w-full overflow-x-auto">
                    <div className="min-w-[720px]">
                      <img
                        src={chartUrl}
                        alt={`GitHub contribution graph for ${username}`}
                        className={`w-full h-auto ${isLight ? "contrast-95 saturate-90" : "contrast-90 saturate-90 brightness-95"}`}
                        loading="lazy"
                      />
                    </div>
                  </div>
                ) : null}

                <p className={`mt-3 text-xs ${isLight ? "text-gray-500" : "text-gray-500"}`}>
                  Data source: GitHub contribution graph
                </p>
              </div>
            ) : (
              <div
                className={`rounded-2xl border p-6 text-center ${
                  isLight ? "bg-gray-50 border-gray-200 text-gray-700" : "bg-black/20 border-white/10 text-gray-300"
                }`}
              >
                <p className="text-sm">
                  Set <span className="font-bold">GITHUB_USERNAME</span> di <span className="font-bold">constant/index.js</span> untuk menampilkan grafik kontribusi.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GitHubContributions;
