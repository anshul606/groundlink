export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Groundlink</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Connecting ground reality to intelligent action
        </p>
        <a
          href="/dashboard"
          className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  );
}
