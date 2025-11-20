"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Target, 
  TrendingDown, 
  Flame, 
  Dumbbell, 
  Apple, 
  Calendar,
  Trophy,
  Sparkles,
  ChevronRight,
  Scale,
  Activity,
  Heart,
  Zap,
  Bell,
  Crown,
  Check,
  Star,
  Award,
  TrendingUp,
  CreditCard,
  Lock
} from "lucide-react"

interface UserProfile {
  name: string
  currentWeight: number
  targetWeight: number
  height: number
  age: number
  gender: string
  activityLevel: string
}

interface DailyProgress {
  day: number
  weight: number
  calories: number
  water: number
  exercise: boolean
}

export default function WeightLossApp() {
  const [step, setStep] = useState<"subscription" | "payment" | "onboarding" | "dashboard">("subscription")
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    currentWeight: 0,
    targetWeight: 0,
    height: 0,
    age: 0,
    gender: "female",
    activityLevel: "moderate"
  })
  
  const [currentDay, setCurrentDay] = useState(1)
  const [dailyProgress, setDailyProgress] = useState<DailyProgress[]>([])
  const [aiMealPlan, setAiMealPlan] = useState<string>("")
  const [aiWorkout, setAiWorkout] = useState<string>("")
  const [loadingMeal, setLoadingMeal] = useState(false)
  const [loadingWorkout, setLoadingWorkout] = useState(false)
  const [motivationalTip, setMotivationalTip] = useState("")
  const [workoutStreak, setWorkoutStreak] = useState(0)
  const [totalWorkouts, setTotalWorkouts] = useState(0)
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const [todayWorkoutDone, setTodayWorkoutDone] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"credit" | "debit" | null>(null)
  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [cardExpiry, setCardExpiry] = useState("")
  const [cardCVV, setCardCVV] = useState("")

  // Sistema de notificações
  useEffect(() => {
    if (step === "dashboard" && notificationsEnabled) {
      // Solicitar permissão de notificação
      if ("Notification" in window && Notification.permission === "default") {
        Notification.requestPermission()
      }

      // Enviar notificação diária
      const sendDailyNotification = () => {
        if (Notification.permission === "granted" && !todayWorkoutDone) {
          new Notification("🏋️ Hora do Treino!", {
            body: `${profile.name}, não esqueça seu treino de hoje! Você está no dia ${currentDay} da sua jornada.`,
            icon: "/icon.svg",
            badge: "/icon.svg"
          })
        }
      }

      // Notificação às 7h da manhã
      const now = new Date()
      const scheduledTime = new Date()
      scheduledTime.setHours(7, 0, 0, 0)
      
      if (now > scheduledTime) {
        scheduledTime.setDate(scheduledTime.getDate() + 1)
      }

      const timeUntilNotification = scheduledTime.getTime() - now.getTime()
      const notificationTimer = setTimeout(sendDailyNotification, timeUntilNotification)

      return () => clearTimeout(notificationTimer)
    }
  }, [step, notificationsEnabled, currentDay, profile.name, todayWorkoutDone])

  // Calcular BMI e calorias diárias recomendadas
  const calculateBMI = () => {
    if (profile.height && profile.currentWeight) {
      const heightInMeters = profile.height / 100
      return (profile.currentWeight / (heightInMeters * heightInMeters)).toFixed(1)
    }
    return "0"
  }

  const calculateDailyCalories = () => {
    let bmr = 0
    if (profile.gender === "female") {
      bmr = 655 + (9.6 * profile.currentWeight) + (1.8 * profile.height) - (4.7 * profile.age)
    } else {
      bmr = 66 + (13.7 * profile.currentWeight) + (5 * profile.height) - (6.8 * profile.age)
    }
    
    const activityMultiplier = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9
    }
    
    const maintenanceCalories = bmr * activityMultiplier[profile.activityLevel as keyof typeof activityMultiplier]
    const deficitCalories = maintenanceCalories - 500
    
    return Math.round(deficitCalories)
  }

  const weightLossGoal = profile.currentWeight - profile.targetWeight
  const progressPercentage = ((currentDay / 30) * 100)

  // Gerar plano alimentar com IA
  const generateMealPlan = async () => {
    setLoadingMeal(true)
    
    setTimeout(() => {
      const calories = calculateDailyCalories()
      const mealPlan = `
🍳 **Café da Manhã (${Math.round(calories * 0.25)} cal)**
- 2 ovos mexidos com espinafre
- 1 fatia de pão integral
- 1 xícara de café com leite desnatado
- 1 porção de frutas vermelhas

🥗 **Almoço (${Math.round(calories * 0.35)} cal)**
- 150g de peito de frango grelhado
- 1 xícara de arroz integral
- Salada verde à vontade com azeite
- Legumes cozidos no vapor

🍎 **Lanche da Tarde (${Math.round(calories * 0.15)} cal)**
- 1 iogurte grego natural
- 1 colher de sopa de granola
- 10 amêndoas

🍽️ **Jantar (${Math.round(calories * 0.25)} cal)**
- 150g de salmão assado
- Batata doce assada
- Brócolis no vapor
- Salada de folhas verdes

💧 **Hidratação**: Beba pelo menos 2-3 litros de água ao longo do dia
      `
      setAiMealPlan(mealPlan)
      setLoadingMeal(false)
    }, 2000)
  }

  // Gerar treino com IA
  const generateWorkout = async () => {
    setLoadingWorkout(true)
    
    setTimeout(() => {
      const workouts = [
        `
🏃‍♀️ **Treino Cardio + HIIT (30 min)**

**Aquecimento (5 min)**
- Polichinelos: 1 min
- Corrida estacionária: 2 min
- Alongamento dinâmico: 2 min

**Circuito HIIT (20 min)** - Repita 4x
- Burpees: 30 seg
- Descanso: 15 seg
- Mountain climbers: 30 seg
- Descanso: 15 seg
- Jumping jacks: 30 seg
- Descanso: 15 seg
- High knees: 30 seg
- Descanso: 30 seg

**Resfriamento (5 min)**
- Caminhada leve: 3 min
- Alongamento estático: 2 min
        `,
        `
💪 **Treino de Força (40 min)**

**Aquecimento (5 min)**
- Mobilidade articular
- Cardio leve

**Circuito A (15 min)** - 3 séries
- Agachamento: 15 reps
- Flexão de braço: 12 reps
- Afundo alternado: 10 reps cada perna

**Circuito B (15 min)** - 3 séries
- Prancha: 45 seg
- Remada com garrafa d'água: 15 reps
- Ponte de glúteo: 20 reps

**Finalização (5 min)**
- Abdominais: 3x15
- Alongamento completo
        `,
        `
🧘‍♀️ **Treino Funcional + Mobilidade (35 min)**

**Parte 1 - Mobilidade (10 min)**
- Rotação de quadril
- Círculos de braço
- Gato-vaca (yoga)
- Alongamento de isquiotibiais

**Parte 2 - Funcional (20 min)**
- Agachamento sumô: 3x15
- Prancha lateral: 3x30seg cada lado
- Step up (escada): 3x12 cada perna
- Superman: 3x15

**Parte 3 - Relaxamento (5 min)**
- Respiração profunda
- Alongamento passivo
- Meditação guiada
        `
      ]
      
      const randomWorkout = workouts[Math.floor(Math.random() * workouts.length)]
      setAiWorkout(randomWorkout)
      setLoadingWorkout(false)
    }, 2000)
  }

  // Gerar dica motivacional
  useEffect(() => {
    const tips = [
      "💪 Cada dia é uma nova oportunidade para ser melhor que ontem!",
      "🌟 Você é mais forte do que pensa. Continue firme!",
      "🎯 Foco no progresso, não na perfeição!",
      "🔥 A disciplina é fazer o que precisa ser feito, mesmo quando não quer.",
      "✨ Seu corpo pode fazer qualquer coisa. É sua mente que você precisa convencer!",
      "🏆 Não desista! Você está mais perto do que imagina.",
      "💎 Transformação leva tempo. Seja paciente consigo mesmo.",
      "🌈 Cada pequena vitória conta. Celebre seu progresso!",
      "⚡ Você não precisa ser perfeito, apenas consistente.",
      "🎨 Seu futuro eu agradecerá pelo esforço de hoje!"
    ]
    setMotivationalTip(tips[Math.floor(Math.random() * tips.length)])
  }, [currentDay])

  const handleStartJourney = () => {
    if (profile.name && profile.currentWeight && profile.targetWeight && profile.height && profile.age) {
      setStep("dashboard")
      generateMealPlan()
      generateWorkout()
      
      // Ativar notificações
      if ("Notification" in window) {
        Notification.requestPermission().then(permission => {
          if (permission === "granted") {
            setNotificationsEnabled(true)
            new Notification("🎉 Bem-vindo!", {
              body: `${profile.name}, sua jornada de transformação começou! Vamos juntos nessa!`,
              icon: "/icon.svg"
            })
          }
        })
      }
    }
  }

  const handleWorkoutComplete = () => {
    setTodayWorkoutDone(true)
    setTotalWorkouts(prev => prev + 1)
    setWorkoutStreak(prev => prev + 1)
    
    // Notificação de parabéns
    if (Notification.permission === "granted") {
      new Notification("🎉 Treino Concluído!", {
        body: `Parabéns! Você completou o treino do dia ${currentDay}. Sequência: ${workoutStreak + 1} dias!`,
        icon: "/icon.svg"
      })
    }
  }

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '')
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned
    return formatted.slice(0, 19) // 16 dígitos + 3 espaços
  }

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4)
    }
    return cleaned
  }

  const handlePayment = () => {
    if (paymentMethod && cardNumber.replace(/\s/g, '').length === 16 && cardName && cardExpiry.length === 5 && cardCVV.length === 3) {
      // Simular processamento de pagamento
      setTimeout(() => {
        setStep("onboarding")
      }, 1500)
    }
  }

  // Tela de assinatura
  if (step === "subscription") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 p-4 md:p-8 flex items-center justify-center">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-6 shadow-2xl">
              <Crown className="w-10 h-10 text-purple-600" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Transforme Seu Corpo em 30 Dias
            </h1>
            <p className="text-xl text-white/90 mb-2">
              Planos personalizados com Inteligência Artificial
            </p>
            <p className="text-lg text-white/80">
              Notificações diárias • Acompanhamento completo • Resultados garantidos
            </p>
          </div>

          <Card className="shadow-2xl border-0 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Star className="w-6 h-6 fill-yellow-300 text-yellow-300" />
                <Star className="w-6 h-6 fill-yellow-300 text-yellow-300" />
                <Star className="w-6 h-6 fill-yellow-300 text-yellow-300" />
                <Star className="w-6 h-6 fill-yellow-300 text-yellow-300" />
                <Star className="w-6 h-6 fill-yellow-300 text-yellow-300" />
              </div>
              <p className="text-sm opacity-90">Mais de 10.000 pessoas transformadas</p>
            </div>

            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="inline-block">
                  <div className="flex items-baseline justify-center gap-2 mb-2">
                    <span className="text-5xl font-bold text-gray-900 dark:text-white">R$ 49,99</span>
                    <span className="text-xl text-gray-600 dark:text-gray-400">/mês</span>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                    Cancele quando quiser
                  </Badge>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Planos Alimentares com IA</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Cardápios personalizados baseados no seu perfil e objetivos</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Treinos Personalizados Diários</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Exercícios adaptados ao seu nível de condicionamento</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Notificações Diárias de Treino</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Lembretes automáticos para você nunca perder um dia</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Sistema de Sequência e Recompensas</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Gamificação para manter você motivado todos os dias</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Acompanhamento Completo</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Gráficos de progresso, IMC, calorias e muito mais</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Suporte e Motivação Diária</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Dicas e mensagens motivacionais para sua jornada</p>
                  </div>
                </div>
              </div>

              <Button 
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg py-6 shadow-xl"
                onClick={() => setStep("payment")}
              >
                Começar Agora por R$ 49,99/mês
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>

              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                Pagamento seguro • Cancele quando quiser • Sem taxas ocultas
              </p>

              <div className="mt-8 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="flex items-start gap-3">
                  <Trophy className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-1">
                      Garantia de 7 Dias
                    </h4>
                    <p className="text-sm text-purple-800 dark:text-purple-200">
                      Se não ficar satisfeito nos primeiros 7 dias, devolvemos 100% do seu dinheiro.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Tela de pagamento
  if (step === "payment") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20 p-4 md:p-8 flex items-center justify-center">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4">
              <CreditCard className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Pagamento Seguro
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Complete sua assinatura de R$ 49,99/mês
            </p>
          </div>

          <Card className="shadow-2xl border-0">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Lock className="w-5 h-5 text-green-600" />
                Dados do Cartão
              </CardTitle>
              <CardDescription>
                Suas informações estão protegidas com criptografia de ponta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Escolha do método de pagamento */}
              <div className="space-y-3">
                <Label>Método de Pagamento</Label>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant={paymentMethod === "credit" ? "default" : "outline"}
                    className="h-auto py-4 flex flex-col gap-2"
                    onClick={() => setPaymentMethod("credit")}
                  >
                    <CreditCard className="w-6 h-6" />
                    <span className="font-semibold">Cartão de Crédito</span>
                    <span className="text-xs opacity-70">Parcelamento disponível</span>
                  </Button>
                  <Button
                    type="button"
                    variant={paymentMethod === "debit" ? "default" : "outline"}
                    className="h-auto py-4 flex flex-col gap-2"
                    onClick={() => setPaymentMethod("debit")}
                  >
                    <CreditCard className="w-6 h-6" />
                    <span className="font-semibold">Cartão de Débito</span>
                    <span className="text-xs opacity-70">Pagamento à vista</span>
                  </Button>
                </div>
              </div>

              {paymentMethod && (
                <>
                  <Separator />

                  {/* Número do cartão */}
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Número do Cartão</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      maxLength={19}
                    />
                  </div>

                  {/* Nome no cartão */}
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Nome no Cartão</Label>
                    <Input
                      id="cardName"
                      placeholder="NOME COMO ESTÁ NO CARTÃO"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value.toUpperCase())}
                    />
                  </div>

                  {/* Validade e CVV */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardExpiry">Validade</Label>
                      <Input
                        id="cardExpiry"
                        placeholder="MM/AA"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                        maxLength={5}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardCVV">CVV</Label>
                      <Input
                        id="cardCVV"
                        type="password"
                        placeholder="123"
                        value={cardCVV}
                        onChange={(e) => setCardCVV(e.target.value.replace(/\D/g, '').slice(0, 3))}
                        maxLength={3}
                      />
                    </div>
                  </div>

                  {/* Resumo do pagamento */}
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Plano Mensal</span>
                      <span className="font-semibold">R$ 49,99</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="font-semibold">Total</span>
                      <span className="text-2xl font-bold text-purple-600">R$ 49,99</span>
                    </div>
                    {paymentMethod === "credit" && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                        Ou 12x de R$ 4,16 sem juros
                      </p>
                    )}
                  </div>

                  {/* Botão de pagamento */}
                  <Button 
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg py-6 shadow-xl"
                    onClick={handlePayment}
                    disabled={!paymentMethod || cardNumber.replace(/\s/g, '').length !== 16 || !cardName || cardExpiry.length !== 5 || cardCVV.length !== 3}
                  >
                    <Lock className="mr-2 w-5 h-5" />
                    Confirmar Pagamento de R$ 49,99
                  </Button>

                  {/* Segurança */}
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Lock className="w-4 h-4" />
                    <span>Pagamento 100% seguro e criptografado</span>
                  </div>
                </>
              )}

              {/* Botão voltar */}
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setStep("subscription")}
              >
                Voltar
              </Button>
            </CardContent>
          </Card>

          {/* Selos de segurança */}
          <div className="mt-6 flex items-center justify-center gap-6 opacity-60">
            <div className="text-center">
              <Lock className="w-8 h-8 mx-auto mb-1 text-gray-400" />
              <p className="text-xs text-gray-500">SSL Seguro</p>
            </div>
            <div className="text-center">
              <CreditCard className="w-8 h-8 mx-auto mb-1 text-gray-400" />
              <p className="text-xs text-gray-500">PCI Compliant</p>
            </div>
            <div className="text-center">
              <Check className="w-8 h-8 mx-auto mb-1 text-gray-400" />
              <p className="text-xs text-gray-500">Verificado</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (step === "onboarding") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20 p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Transforme-se em 30 Dias
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Seu assistente inteligente para emagrecimento saudável
            </p>
          </div>

          <Card className="shadow-2xl border-0">
            <CardHeader>
              <CardTitle className="text-2xl">Vamos começar sua jornada!</CardTitle>
              <CardDescription>
                Preencha seus dados para criar um plano personalizado com IA
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  placeholder="Como você gostaria de ser chamado?"
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentWeight">Peso Atual (kg)</Label>
                  <Input
                    id="currentWeight"
                    type="number"
                    placeholder="Ex: 75"
                    value={profile.currentWeight || ""}
                    onChange={(e) => setProfile({...profile, currentWeight: Number(e.target.value)})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetWeight">Peso Desejado (kg)</Label>
                  <Input
                    id="targetWeight"
                    type="number"
                    placeholder="Ex: 65"
                    value={profile.targetWeight || ""}
                    onChange={(e) => setProfile({...profile, targetWeight: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="height">Altura (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="Ex: 165"
                    value={profile.height || ""}
                    onChange={(e) => setProfile({...profile, height: Number(e.target.value)})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Idade</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Ex: 30"
                    value={profile.age || ""}
                    onChange={(e) => setProfile({...profile, age: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Gênero</Label>
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant={profile.gender === "female" ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => setProfile({...profile, gender: "female"})}
                  >
                    Feminino
                  </Button>
                  <Button
                    type="button"
                    variant={profile.gender === "male" ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => setProfile({...profile, gender: "male"})}
                  >
                    Masculino
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Nível de Atividade</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {[
                    { value: "sedentary", label: "Sedentário" },
                    { value: "light", label: "Leve" },
                    { value: "moderate", label: "Moderado" },
                    { value: "active", label: "Ativo" },
                    { value: "veryActive", label: "Muito Ativo" }
                  ].map((level) => (
                    <Button
                      key={level.value}
                      type="button"
                      variant={profile.activityLevel === level.value ? "default" : "outline"}
                      className="text-sm"
                      onClick={() => setProfile({...profile, activityLevel: level.value})}
                    >
                      {level.label}
                    </Button>
                  ))}
                </div>
              </div>

              <Button 
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-lg py-6"
                onClick={handleStartJourney}
              >
                Começar Minha Transformação
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Olá, {profile.name}! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              {motivationalTip}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <Calendar className="w-4 h-4 mr-2" />
              Dia {currentDay} de 30
            </Badge>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                if ("Notification" in window && Notification.permission === "default") {
                  Notification.requestPermission().then(permission => {
                    if (permission === "granted") {
                      setNotificationsEnabled(true)
                      new Notification("🔔 Notificações Ativadas!", {
                        body: "Você receberá lembretes diários para treinar!",
                        icon: "/icon.svg"
                      })
                    }
                  })
                }
              }}
            >
              <Bell className={`w-5 h-5 ${notificationsEnabled ? 'text-purple-600' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Streak Card */}
        <Card className="bg-gradient-to-r from-orange-500 to-pink-500 text-white border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Flame className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{workoutStreak} dias seguidos</h3>
                  <p className="text-white/90">Sequência de treinos • Total: {totalWorkouts} treinos</p>
                </div>
              </div>
              {!todayWorkoutDone && (
                <Badge className="bg-white text-orange-600 hover:bg-white/90">
                  Treino pendente hoje
                </Badge>
              )}
              {todayWorkoutDone && (
                <Badge className="bg-green-500 text-white border-0">
                  <Check className="w-4 h-4 mr-1" />
                  Concluído hoje!
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Target className="w-4 h-4" />
                Meta de Peso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{profile.targetWeight} kg</div>
              <p className="text-purple-100 text-sm mt-1">
                Faltam {weightLossGoal.toFixed(1)} kg
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-500 to-pink-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Scale className="w-4 h-4" />
                Peso Atual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{profile.currentWeight} kg</div>
              <p className="text-pink-100 text-sm mt-1">
                IMC: {calculateBMI()}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Flame className="w-4 h-4" />
                Calorias/Dia
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{calculateDailyCalories()}</div>
              <p className="text-orange-100 text-sm mt-1">
                Déficit saudável
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                Progresso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{progressPercentage.toFixed(0)}%</div>
              <p className="text-green-100 text-sm mt-1">
                {currentDay} dias completos
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Progress Bar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Progresso da Jornada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={progressPercentage} className="h-3" />
            <div className="flex justify-between mt-2 text-sm text-gray-600 dark:text-gray-400">
              <span>Início</span>
              <span className="font-semibold text-purple-600 dark:text-purple-400">
                Dia {currentDay}/30
              </span>
              <span>Meta</span>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="workout" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="workout" className="flex items-center gap-2">
              <Dumbbell className="w-4 h-4" />
              <span className="hidden sm:inline">Treino Hoje</span>
            </TabsTrigger>
            <TabsTrigger value="meal" className="flex items-center gap-2">
              <Apple className="w-4 h-4" />
              <span className="hidden sm:inline">Alimentação</span>
            </TabsTrigger>
            <TabsTrigger value="tracking" className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4" />
              <span className="hidden sm:inline">Acompanhamento</span>
            </TabsTrigger>
          </TabsList>

          {/* Workout Tab */}
          <TabsContent value="workout" className="space-y-4">
            <Card className="border-2 border-orange-200 dark:border-orange-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-orange-500" />
                      Treino de Hoje - Dia {currentDay}
                    </CardTitle>
                    <CardDescription>
                      {todayWorkoutDone ? "✅ Treino concluído! Parabéns!" : "Seu treino personalizado está pronto"}
                    </CardDescription>
                  </div>
                  {todayWorkoutDone && (
                    <Award className="w-12 h-12 text-yellow-500" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {!aiWorkout ? (
                  <div className="text-center py-8">
                    <Dumbbell className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Gere seu treino personalizado
                    </p>
                    <Button 
                      onClick={generateWorkout}
                      disabled={loadingWorkout}
                      className="bg-gradient-to-r from-orange-500 to-pink-500"
                    >
                      {loadingWorkout ? "Gerando..." : "Gerar Treino com IA"}
                      <Zap className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div>
                    <div className="prose dark:prose-invert max-w-none">
                      <div className="whitespace-pre-line text-sm leading-relaxed">
                        {aiWorkout}
                      </div>
                    </div>
                    <Separator className="my-4" />
                    <div className="flex gap-2">
                      {!todayWorkoutDone ? (
                        <Button 
                          onClick={handleWorkoutComplete}
                          className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 text-lg py-6"
                        >
                          <Check className="mr-2 w-5 h-5" />
                          Marcar Treino como Concluído
                        </Button>
                      ) : (
                        <Button 
                          disabled
                          className="flex-1 bg-green-500 text-lg py-6"
                        >
                          <Check className="mr-2 w-5 h-5" />
                          Treino Concluído Hoje!
                        </Button>
                      )}
                      <Button 
                        onClick={generateWorkout}
                        disabled={loadingWorkout}
                        variant="outline"
                      >
                        Novo Treino
                      </Button>
                    </div>
                  </div>
                )}

                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                  <div className="flex items-start gap-3">
                    <Bell className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-1">
                        Notificações Ativadas
                      </h4>
                      <p className="text-sm text-orange-800 dark:text-orange-200">
                        Você receberá um lembrete todos os dias às 7h da manhã para não perder seu treino!
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Meal Plan Tab */}
          <TabsContent value="meal" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  Plano Alimentar Personalizado com IA
                </CardTitle>
                <CardDescription>
                  Baseado nas suas necessidades calóricas de {calculateDailyCalories()} calorias/dia
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!aiMealPlan ? (
                  <div className="text-center py-8">
                    <Apple className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Gere seu plano alimentar personalizado
                    </p>
                    <Button 
                      onClick={generateMealPlan}
                      disabled={loadingMeal}
                      className="bg-gradient-to-r from-purple-500 to-pink-500"
                    >
                      {loadingMeal ? "Gerando..." : "Gerar Plano com IA"}
                      <Sparkles className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div>
                    <div className="prose dark:prose-invert max-w-none">
                      <div className="whitespace-pre-line text-sm leading-relaxed">
                        {aiMealPlan}
                      </div>
                    </div>
                    <Separator className="my-4" />
                    <div className="flex gap-2">
                      <Button 
                        onClick={generateMealPlan}
                        disabled={loadingMeal}
                        variant="outline"
                        className="flex-1"
                      >
                        Gerar Novo Plano
                      </Button>
                    </div>
                  </div>
                )}

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start gap-3">
                    <Heart className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                        Dicas Importantes
                      </h4>
                      <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                        <li>• Beba água antes das refeições</li>
                        <li>• Mastigue devagar e aprecie cada mordida</li>
                        <li>• Evite pular refeições</li>
                        <li>• Prepare suas refeições com antecedência</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tracking Tab */}
          <TabsContent value="tracking" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  Acompanhamento Diário
                </CardTitle>
                <CardDescription>
                  Registre seu progresso para melhores resultados
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="todayWeight">Peso de Hoje (kg)</Label>
                    <Input
                      id="todayWeight"
                      type="number"
                      placeholder={profile.currentWeight.toString()}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="todayCalories">Calorias Consumidas</Label>
                    <Input
                      id="todayCalories"
                      type="number"
                      placeholder={calculateDailyCalories().toString()}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="waterIntake">Água (copos de 250ml)</Label>
                    <Input
                      id="waterIntake"
                      type="number"
                      placeholder="8"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Exercício Hoje?</Label>
                    <div className="flex gap-2">
                      <Button 
                        variant={todayWorkoutDone ? "default" : "outline"} 
                        className="flex-1"
                        onClick={() => !todayWorkoutDone && handleWorkoutComplete()}
                      >
                        Sim ✅
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Não ❌
                      </Button>
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-green-500 to-teal-500">
                  Salvar Progresso do Dia
                </Button>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-4">Estatísticas da Semana</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <span className="text-sm">Sequência de Treinos</span>
                      <span className="font-semibold text-orange-600">{workoutStreak} dias 🔥</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <span className="text-sm">Total de Treinos</span>
                      <span className="font-semibold">{totalWorkouts} treinos</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <span className="text-sm">Peso Médio</span>
                      <span className="font-semibold">{profile.currentWeight} kg</span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-start gap-3">
                    <Trophy className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-green-900 dark:text-green-100 mb-1">
                        Continue Assim!
                      </h4>
                      <p className="text-sm text-green-800 dark:text-green-200">
                        Você está no caminho certo. A consistência é a chave para o sucesso!
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button 
            variant="outline" 
            className="h-auto py-4 flex flex-col gap-2"
            onClick={() => {
              setCurrentDay(prev => Math.min(prev + 1, 30))
              setTodayWorkoutDone(false)
            }}
          >
            <Calendar className="w-6 h-6" />
            <span className="text-sm">Próximo Dia</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto py-4 flex flex-col gap-2"
            onClick={generateMealPlan}
          >
            <Apple className="w-6 h-6" />
            <span className="text-sm">Nova Dieta</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto py-4 flex flex-col gap-2"
            onClick={generateWorkout}
          >
            <Dumbbell className="w-6 h-6" />
            <span className="text-sm">Novo Treino</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto py-4 flex flex-col gap-2"
            onClick={() => {
              const tips = [
                "💪 Cada dia é uma nova oportunidade!",
                "🌟 Você é mais forte do que pensa!",
                "🎯 Foco no progresso, não na perfeição!",
                "🔥 A disciplina vence a motivação!",
                "✨ Transformação leva tempo!"
              ]
              setMotivationalTip(tips[Math.floor(Math.random() * tips.length)])
            }}
          >
            <Heart className="w-6 h-6" />
            <span className="text-sm">Motivação</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
