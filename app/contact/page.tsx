import Header from "../_components/header";
import Footer from "../_components/footer";
import ContactForm from "./ContactForm";

export default function ContactPage() {
  return (
    <>
      <Header title="Contact Us" />
      <main className="p-6">
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
