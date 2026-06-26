export default function SiteBanner() {
  return (
    <div
      role="alert"
      className="fixed top-0 left-0 w-full h-10 z-[60] flex items-center justify-center bg-red-600 px-4 text-center text-white"
    >
      <p className="text-xs sm:text-sm font-medium leading-tight">
        This site has been taken down and is no longer functional — the backend
        is offline. This is a static front-end demo only.
      </p>
    </div>
  );
}
