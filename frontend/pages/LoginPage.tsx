import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import backend from '~backend/client';

export default function LoginPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAuthSuccess = (data: any) => {
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    window.dispatchEvent(new Event('authChange'));
    toast({
      title: "Başarılı",
      description: "Giriş yapıldı.",
    });
    navigate('/profile');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = await backend.user.login({
        email: loginEmail,
        provider: 'email',
        // password is not sent to backend in this mock, but would be in a real app
      });
      handleAuthSuccess(data);
    } catch (error: any) {
      toast({
        title: "Giriş Başarısız",
        description: error.message || "Lütfen bilgilerinizi kontrol edin.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = await backend.user.register({
        name: registerName,
        email: registerEmail,
        password: registerPassword,
        provider: 'email',
      });
      handleAuthSuccess(data);
    } catch (error: any) {
      toast({
        title: "Kayıt Başarısız",
        description: error.message || "Lütfen bilgilerinizi kontrol edin.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-gray-50 p-4">
      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Giriş Yap</TabsTrigger>
          <TabsTrigger value="register">Kayıt Ol</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Giriş Yap</CardTitle>
              <CardDescription>
                Hesabınıza erişmek için giriş yapın.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input id="login-email" type="email" placeholder="m@example.com" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Şifre</Label>
                  <Input id="login-password" type="password" required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
                </div>
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isSubmitting}>
                  {isSubmitting ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="register">
          <Card>
            <CardHeader>
              <CardTitle>Kayıt Ol</CardTitle>
              <CardDescription>
                Yeni bir hesap oluşturun.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name">İsim</Label>
                  <Input id="register-name" placeholder="Adınız Soyadınız" required value={registerName} onChange={(e) => setRegisterName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input id="register-email" type="email" placeholder="m@example.com" required value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Şifre</Label>
                  <Input id="register-password" type="password" required value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} />
                </div>
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isSubmitting}>
                  {isSubmitting ? 'Kayıt Olunuyor...' : 'Kayıt Ol'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
