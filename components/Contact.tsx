import React from 'react';
import { useContent } from '../hooks/useContent';
import { MailIcon, PhoneIcon, LocationMarkerIcon, ClockIcon, PaperAirplaneIcon } from './Icons';

const Contact: React.FC = () => {
  const { content } = useContent();
  const { contact: contactContent } = content;
    
  const Label: React.FC<{ htmlFor: string, children: React.ReactNode }> = ({ htmlFor, children }) => (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-300 mb-1">{children}</label>
  );

  const Input: React.FC<{ id: string, type: string, placeholder?: string }> = ({ id, type, placeholder }) => (
    <input type={type} id={id} className="w-full bg-[#2a2a2a] border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-red-500 focus:border-red-500" placeholder={placeholder} />
  );
    
  return (
    <section id="contact" className="py-20 md:py-28 bg-[#1f1f1f]">
      <div className="container mx-auto px-6">
        <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold">{contactContent.headline}</h2>
            <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
                {contactContent.subheading.line1}
                <br />
                {contactContent.subheading.line2}
            </p>
        </div>
        <div className="mt-16 grid lg:grid-cols-2 gap-16 items-start">
            <div>
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3"><span className="text-red-600">|</span> {contactContent.connect.title}</h3>
                <p className="text-gray-300 mb-8">
                    {contactContent.connect.paragraph}
                </p>
                <div className="space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="bg-gray-800 p-3 rounded-full"><MailIcon className="h-6 w-6 text-red-500"/></div>
                        <div>
                            <h4 className="font-semibold">Email</h4>
                            <p className="text-gray-400">{contactContent.details.email.address}</p>
                            <p className="text-sm text-gray-500">{contactContent.details.email.note}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="bg-gray-800 p-3 rounded-full"><PhoneIcon className="h-6 w-6 text-red-500"/></div>
                        <div>
                            <h4 className="font-semibold">Phone</h4>
                            <p className="text-gray-400">{contactContent.details.phone.number}</p>
                            <p className="text-sm text-gray-500">{contactContent.details.phone.note}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="bg-gray-800 p-3 rounded-full"><LocationMarkerIcon className="h-6 w-6 text-red-500"/></div>
                        <div>
                            <h4 className="font-semibold">Location</h4>
                            <p className="text-gray-400">{contactContent.details.location.name}</p>
                            <p className="text-gray-400">{contactContent.details.location.address}</p>
                            <p className="text-sm text-gray-500">{contactContent.details.location.note}</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-4">
                        <div className="bg-gray-800 p-3 rounded-full"><ClockIcon className="h-6 w-6 text-red-500"/></div>
                        <div>
                            <h4 className="font-semibold">Availability</h4>
                            {contactContent.details.availability.map((line, index) => (
                              <p key={index} className="text-gray-400">{line}</p>
                            ))}
                        </div>
                    </div>
                </div>
                 <div className="mt-8 bg-red-900/20 border border-red-800/50 p-6 rounded-lg">
                    <h4 className="font-semibold text-red-400">{contactContent.guarantee.title}</h4>
                    <p className="text-gray-400 mt-2 text-sm">{contactContent.guarantee.text}</p>
                </div>
            </div>
            <div className="bg-[#2a2a2a] p-8 rounded-lg">
                <h3 className="text-2xl font-bold mb-6">{contactContent.form.title}</h3>
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                    <div>
                        <Label htmlFor="contactName">{contactContent.form.nameLabel}</Label>
                        <Input id="contactName" type="text"/>
                    </div>
                    <div>
                        <Label htmlFor="contactEmail">{contactContent.form.emailLabel}</Label>
                        <Input id="contactEmail" type="email"/>
                    </div>
                    <div>
                        <Label htmlFor="subject">{contactContent.form.subjectLabel}</Label>
                        <Input id="subject" type="text" placeholder={contactContent.form.subjectPlaceholder}/>
                    </div>
                    <div>
                        <Label htmlFor="message">{contactContent.form.messageLabel}</Label>
                        <textarea id="message" rows={5} className="w-full bg-[#2a2a2a] border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-red-500 focus:border-red-500" placeholder={contactContent.form.messagePlaceholder}></textarea>
                    </div>
                    <div>
                         <button type="submit" className="w-full bg-red-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-800 transition-colors inline-flex items-center justify-center gap-2">
                            {contactContent.form.buttonText} <PaperAirplaneIcon className="h-5 w-5"/>
                        </button>
                    </div>
                </form>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
