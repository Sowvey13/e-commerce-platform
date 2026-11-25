export default function UsersPage({ users, usersLoading }) {
  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <h1 className="page-title">Kullanıcı Listesi</h1>
          <p className="page-subtitle">
            Sistemde kayıtlı kullanıcıları ve rollerini görüntüle.
          </p>
        </div>
      </div>

      <section className="card-panel">
        <h2 className="section-title">Kayıtlı Kullanıcılar ({users.length})</h2>

        {usersLoading ? (
          <p style={{ margin: 0 }}>Kullanıcılar yükleniyor...</p>
        ) : users.length === 0 ? (
          <p className="item-meta">Listelenecek kullanıcı bulunamadı.</p>
        ) : (
          <div className="list-stack">
            {users.map((u) => (
              <div key={u.id} className="list-item">
                <div>
                  <strong>{u.name ?? `Kullanıcı #${u.id}`}</strong>
                  <div className="item-meta">{u.email}</div>
                </div>

                <span className="badge-role">{u.role ?? 'customer'}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}