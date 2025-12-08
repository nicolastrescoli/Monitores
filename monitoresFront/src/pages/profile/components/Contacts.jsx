import { Link } from "react-router-dom";
import { RemoveFriend } from "../../components/buttons/removeFriend.jsx";
import { useSelector } from "react-redux";

export function Contacts() {

  const { contacts } = useSelector((state) => state.auth.loggedUser);

  return (
    <div className="col-lg-3 col-12">
      <div className="card shadow border-0">
        <div className="card-header bg-secondary text-white">
          <h5 className="mb-0">Contactos</h5>
        </div>
        <div className="card-body">
          {contacts.length === 0 ? (
            <div className="alert alert-info">Aún no tienes contactos.</div>
          ) : (
            <div className="row">
              {contacts.map((contact) => (
                <div key={contact.id} className="col-12 mb-3">
                  <div className="card border-light shadow-sm">
                    <div className="card-body text-center">
                      <Link
                        to={`/profile/${contact.id}`}
                        className="btn btn-outline-dark btn-sm me-2 col-10"
                      >
                        <strong className="card-title">{contact.name}</strong>
                        <small> - ver perfil</small>
                      </Link>
                      <RemoveFriend otherUserId={contact.id} text={"X"} />
                    </div>
                    {/* {false ? (
                      <div className="text-start text-primary mx-3 mt-0 mb-2">
                        🔹 Nueva actividad
                      </div>
                    ) : (
                      ""
                    )} */}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

