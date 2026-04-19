import { Sparkles, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-gray-100 bg-white/60 mt-24" data-testid="main-footer">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12 grid md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#7C6CF6] to-[#FFB7A5] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-heading font-bold text-lg">ReLaunch.AI</span>
          </div>
          <p className="text-sm text-gray-600 mt-3 max-w-md">
            A warm, intelligent comeback companion for women returning to the workforce. Built with care, powered by AI,
            designed for confidence.
          </p>
          <p className="text-xs text-gray-400 mt-6 flex items-center gap-1">
            Crafted with <Heart className="w-3 h-3 text-[#FFB7A5]" fill="#FFB7A5" /> for every woman restarting her story.
          </p>
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Product</div>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>Resume Enhancer</li>
            <li>Skill Gap Analyzer</li>
            <li>Interview Coach</li>
            <li>Career Break Story</li>
          </ul>
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Company</div>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>About</li>
            <li>Community</li>
            <li>Privacy</li>
            <li>Contact</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-100 py-4 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} ReLaunch.AI — Restart with confidence.
      </div>
    </footer>
  );
};

export default Footer;
