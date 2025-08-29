import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";


import { mockProviders } from "@/data/mockData";
import { getAtendentes } from "@/api/users";
import { getProviders } from "@/api/providers"; 
import { createDemand } from "@/api/demands";

import { Provider, User, DemandType, DemandPriority } from "@/generated/prisma"; 

import { DEMAND_TYPE_LABELS, DEMAND_PRIORITY_LABELS} from "@/types";

const demandSchema = z.object({
  title: z.string().min(5, "Título deve ter pelo menos 5 caracteres"),
  description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  type: z.string(),
  priority: z.string(),
  providerId: z.string().min(1, "Selecione um provedor"),
  atendenteId: z.string().min(1, "Selecione o atendente"), 
});

type DemandFormData = z.infer<typeof demandSchema>;

export default function NewDemand() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [providers, setProviders] = useState<Provider[]>([]);
  const [atendentes, setAtendentes] = useState<User[]>([]);

  const form = useForm<DemandFormData>({
    resolver: zodResolver(demandSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "",
      priority: "",
      providerId: "",
      atendenteId: "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingData(true);
      try {
        const [providersData, atendentesData] = await Promise.all([
          getProviders(),
          getAtendentes(),
        ]);
        setProviders(providersData);
        setAtendentes(atendentesData);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchData();
  }, []);

  const onSubmit = async (data: DemandFormData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        titulo: data.title,
        descricao: data.description,
        // CORREÇÃO: Converte os valores para maiúsculas
        tipo: data.type.toUpperCase(),
        prioridade: data.priority.toUpperCase(),
        providerId: data.providerId,
        atendenteId: data.atendenteId,
      };

      // Agora o `payload` está com os valores no formato correto para a API
      await createDemand(payload);
      
      toast({
        title: "Sucesso!",
        description: "Demanda cadastrada com sucesso.",
      });
      
      navigate("/demands");
    } catch (error) {
      console.error("Erro ao cadastrar demanda:", error);
      toast({
        title: "Erro",
        description: "Não foi possível cadastrar a demanda.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingData) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg text-muted-foreground">Carregando dados...</span>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen flex flex-col items-center justify-start py-8 px-4">
        <div className="w-full max-w-4xl space-y-6">
          <div className="flex flex-col items-center text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Cadastrar Demanda</h1>
            <p className="text-muted-foreground">
                Adicione uma nova demanda ao sistema
            </p>
            </div>


          <div className="flex justify-center">
            <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Informações da Demanda</CardTitle>
            <CardDescription>
              Preencha os dados da nova demanda
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o título da demanda" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Descreva os detalhes da demanda" 
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(DEMAND_TYPE_LABELS).map(([key, label]) => (
                              <SelectItem key={key} value={key}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prioridade</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a prioridade" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(DEMAND_PRIORITY_LABELS).map(([key, label]) => (
                              <SelectItem key={key} value={key}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="providerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Provedor</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o provedor" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {providers.map((provider) => (
                            <SelectItem key={provider.id} value={provider.id}>
                              {provider.nomeFantasia}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                      control={form.control}
                      name="atendenteId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Atendente</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o atendente" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {atendentes.map((atendente) => (
                                <SelectItem key={atendente.id} value={atendente.id}>
                                  {atendente.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                <div className="flex space-x-4 pt-4">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex items-center space-x-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>{isSubmitting ? "Salvando..." : "Salvar Demanda"}</span>
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate("/demands")}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}