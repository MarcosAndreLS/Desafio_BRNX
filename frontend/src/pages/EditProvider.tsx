// Dentro de EditProvider.tsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowLeft, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
// Importe as novas funções da API
import { getProviderById, updateProvider } from "@/api/providers";

const providerSchema = z.object({
  nomeFantasia: z.string().min(2, "Nome fantasia deve ter pelo menos 2 caracteres"),
  responsavel: z.string().min(2, "Nome do responsável deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  telefone: z.string().min(10, "Telefone deve ter pelo menos 10 caracteres"),
});

type ProviderFormData = z.infer<typeof providerSchema>;

export default function EditProvider() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<ProviderFormData>({
    resolver: zodResolver(providerSchema),
  });

  // useEffect para carregar os dados do provedor
  useEffect(() => {
    const loadProvider = async () => {
      if (!id) {
        navigate("/providers");
        return;
      }
      try {
        const data = await getProviderById(id);
        // Preenche o formulário com os dados do backend
        form.reset({
          nomeFantasia: data.nomeFantasia,
          responsavel: data.responsavel,
          email: data.email,
          telefone: data.telefone,
        });
        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao carregar provedor:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados do provedor.",
          variant: "destructive",
        });
        navigate("/providers");
      }
    };

    loadProvider();
  }, [id, form, navigate, toast]);

  const onSubmit = async (data: ProviderFormData) => {
    if (!id) return;
    setIsSubmitting(true);
    
    try {
      // Chama a API de atualização
      await updateProvider(id, data);
      
      toast({
        title: "Sucesso!",
        description: "Provedor atualizado com sucesso.",
      });
      
      navigate("/providers");
    } catch (error) {
      console.error("Erro ao atualizar provedor:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar o provedor.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Carregando ou Provedor não encontrado
  if (isLoading) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-foreground">Carregando...</h2>
        </div>
      </AppLayout>
    );
  }

  // Se o provedor não foi encontrado após o carregamento (ex: API retornou 404)
  if (!form.formState.isSubmitted && !form.formState.isValid) {
      const currentValues = form.getValues();
      if (Object.values(currentValues).every(val => val === "")) {
        return (
            <AppLayout>
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-foreground">Provedor não encontrado</h2>
                <Button onClick={() => navigate("/providers")} className="mt-4">
                  Voltar para Provedores
                </Button>
              </div>
            </AppLayout>
        );
      }
  }


  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="w-full max-w-4xl space-y-6">
          <div className="flex flex-col items-center text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Editar Provedor</h1>
            <p className="text-muted-foreground">
              Atualize as informações do provedor
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações do Provedor</CardTitle>
            <CardDescription>
              Preencha os dados atualizados do provedor
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="nomeFantasia"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Fantasia</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome da empresa" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="responsavel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Responsável</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome completo do responsável" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="email@exemplo.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="telefone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input placeholder="(11) 99999-9999" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-4">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? "Atualizando..." : "Atualizar Provedor"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate("/providers")}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}