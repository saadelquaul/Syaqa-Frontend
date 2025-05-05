import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6 py-12">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-9xl font-extrabold text-[#F97316]">404</h1>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Page introuvable</h2>
          <p className="mt-2 text-lg text-gray-600">
            Désolé, nous n'avons pas trouvé la page que vous recherchez.
          </p>
        </div>
        
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            Retour
          </Button>
          
          <Link to="/">
            <Button className="flex items-center gap-2 bg-[#F97316] hover:bg-orange-600">
              <Home size={18} />
              Accueil
            </Button>
          </Link>
        </div>
        
        <div className="mt-10 pt-10 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Si vous pensez qu'il s'agit d'une erreur, veuillez contacter le support.
          </p>
        </div>
      </div>
    </div>
  );
}