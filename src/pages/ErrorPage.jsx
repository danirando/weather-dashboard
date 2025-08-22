export default function ErrorPage() {
  return (
    <div className="container py-5 text-center">
      <h1 className="display-6">Errore interno (500)</h1>
      <p className="mb-4">Qualcosa è andato storto. Riprova più tardi.</p>
      <a className="btn btn-secondary" href="/">Torna alla Dashboard</a>
    </div>
  );
}
