export default function Footer() {
    return (
      <footer className="bg-neutral p-10 text-neutral-content">
        <div className="footer m-auto max-w-7xl">
          <div>
            <span className="footer-title">Servicios</span>
            <a className="link-hover link">Marca</a>
            <a className="link-hover link">Diseño</a>
            <a className="link-hover link">Marketing</a>
            <a className="link-hover link">Anuncios</a>
          </div>
          <div>
            <span className="footer-title">Compañia</span>
            <a className="link-hover link">Conócenos</a>
            <a className="link-hover link">Contacto</a>
            <a className="link-hover link">Trabaja con Nosotros</a>
            <a className="link-hover link">Prensa</a>
          </div>
          <div>
            <span className="footer-title">Información Legal</span>
            <a className="link-hover link">Terminos y Condiciones</a>
            <a className="link-hover link">Política de Privacidad</a>
            <a className="link-hover link">Política de Cookies</a>
          </div>
        </div>
      </footer>
    );
  }