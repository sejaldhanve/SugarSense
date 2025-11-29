import React, { useState, FormEvent } from 'react';
import { Mail } from 'lucide-react';
import emailjs from 'emailjs-com';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    emailjs
      .send(
        'service_mz8h94r', // Your Gmail Service ID
        'template_ms09b1k', // Your Template ID
        {
          name: formData.name,
          email: formData.email,
          message: formData.message,
        },
        'vXYP0Vk8kKQj22ot0' // Your Public Key
      )
      .then(
        (response) => {
          console.log('SUCCESS!', response.status, response.text);
          setStatus('Message sent successfully!');
          setFormData({ name: '', email: '', message: '' }); // Clear form fields
        },
        (err) => {
          console.error('FAILED...', err);
          console.error('Error details:', err.text);  // More detailed error logging
          setStatus('Failed to send the message. Please try again.');
        }
      );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  return (
    <section id="contact-us" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-16 text-[#29524A]">
          Contact Us
        </h2>

        <div className="max-w-xl mx-auto">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#29524A] focus:ring-[#29524A]"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#29524A] focus:ring-[#29524A]"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#29524A] focus:ring-[#29524A]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#29524A] text-white py-3 px-6 rounded-md hover:bg-[#1f3d37] transition-colors duration-200"
            >
              Send Message
            </button>
          </form>

          <div className="mt-8 text-center">
            <a
              href="mailto:support@diazone.com"
              className="inline-flex items-center text-[#29524A] hover:underline"
            >
              <Mail className="h-5 w-5 mr-2" />
              Contact us at support@diazone.com
            </a>
          </div>

          {status && (
            <div className="mt-4 text-center text-sm font-medium">
              <p>{status}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

// Only one default export per file
export default Contact;
