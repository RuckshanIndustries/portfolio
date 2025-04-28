import { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase'; // Create separate firebase config
import GlassmorphicPanel from '@/components/glassmorphic-panel';
import { Button } from '@/components/ui/button'; // Use appropriate button component

const ContactForm = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !email || !message) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            await addDoc(collection(db, 'messages'), {
                name,
                email,
                message,
                timestamp: new Date(),
            });

            setSuccess(true);
            setName('');
            setEmail('');
            setMessage('');
        } catch (err) {
            console.error('Submission error:', err);
            setError('Error sending message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <GlassmorphicPanel className="p-6">
            <h3 className="text-xl font-bold mb-4 text-zinc-800">Send a Message</h3>
            <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-zinc-700">
                        Name
                    </label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                        placeholder="Your name"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-zinc-700">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                        placeholder="Your email"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-zinc-700">
                        Message
                    </label>
                    <textarea
                        id="message"
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                        placeholder="Your message"
                        required
                    />
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}
                {success && <p className="text-green-500 text-sm">Message sent successfully!</p>}

                <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white border-none"
                    disabled={loading}
                >
                    {loading ? 'Sending...' : 'Send Message'}
                </Button>
            </form>
        </GlassmorphicPanel>
    );
};

export default ContactForm;