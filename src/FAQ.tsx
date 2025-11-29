import React from 'react';

const faqs = [
  {
    question: "What makes DiaZone products diabetic-friendly?",
    answer: "Our products are specially formulated with low glycemic index ingredients and natural sweeteners that don't spike blood sugar levels."
  },
  {
    question: "How can I order DiaZone products?",
    answer: "You can order directly through our website by selecting your desired products and proceeding to checkout. We ship across the United States."
  },
  {
    question: "Where are your products sourced from?",
    answer: "We source our ingredients from certified organic farms and trusted suppliers who meet our strict quality standards."
  }
];

const testimonials = [
  {
    name: "Sarah Johnson",
    text: "DiaZone's products have made managing my diabetes so much easier while still enjoying my favorite treats!",
    image: ""
  },
  {
    name: "Michael Chen",
    text: "The natural sweeteners are amazing. Finally, I can bake without worry!",
    image: ""
  }
];

const FAQ = () => {
  return (
    <section id="faq" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-16 text-[#29524A]">
          Frequently Asked Questions
        </h2>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>

          <div className="space-y-8">
            <h3 className="text-2xl font-bold mb-8">What Our Customers Say</h3>
            {testimonials.map((testimonial, index) => (
              <div key={index} className="flex items-start space-x-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <p className="text-gray-600 mb-2">{testimonial.text}</p>
                  <p className="font-medium">{testimonial.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;