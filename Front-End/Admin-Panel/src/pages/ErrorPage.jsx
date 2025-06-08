function ErrorPage() {
  return (
    <div className="vh-100 overflow-hidden body">
      <main>
        <section
          className="w-100 vh-100 d-flex flex-column justify-content-center 
          align-items-center text-black fs-1"
        >
          <div className="row w-100 justify-content-center">
            <div className="col-6 text-wrap text-center">
              <h1 style={{ fontSize: "1.5em" }}>Wrong Page</h1>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default ErrorPage;