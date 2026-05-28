import type { Locale } from "@/lib/i18n/config";

export const dictionaries = {
  es: {
    nav: { pricing: "Precios", login: "Ingresar", dashboard: "Panel" },
    landing: {
      badge: "BeautyTech premium con IA",
      subtitle:
        "Informes de visagismo con IA para barberias, salones y negocios de belleza que quieren vender asesoria premium, fidelizar clientes y entregar resultados memorables.",
      primaryCta: "Lo quiero para mi negocio",
      secondaryCta: "Iniciar sesion",
      clientReport: "Informe del cliente",
      done: "Listo",
      heroCardTitle: "Balance ovalado",
      heroCardText:
        "Volumen suave, laterales definidos y acentos calidos crean un look pulido alineado con la estructura facial visible del cliente.",
      faceShape: "Forma facial",
      colorimetry: "Colorimetria",
      stylePlan: "Plan de estilo",
      howItWorks: "Como funciona",
      workflowTitle: "Disenado para flujos reales de salon.",
      benefits: [
        "Consultas premium en minutos",
        "Analisis estructurado con lenguaje profesional",
        "Informes PDF de marca listos para compartir",
        "Modelo de creditos escalable"
      ],
      steps: [
        { title: "Sube", text: "Captura o sube una foto clara del cliente." },
        { title: "Analiza", text: "Genera morfologia facial y colorimetria." },
        { title: "Entrega", text: "Comparte un PDF de marca por WhatsApp o descarga." }
      ],
      cards: [
        {
          title: "Experiencia premium",
          text: "Dale al cliente algo concreto, elegante y facil de entender."
        },
        {
          title: "Informes de marca",
          text: "Cada resultado queda preparado para PDF y branding del negocio."
        },
        {
          title: "Construido para confianza",
          text: "Claves server-side, almacenamiento privado y arquitectura por roles."
        }
      ]
    },
    login: {
      title: "Ingreso de negocio",
      subtitle: "Accede a tu espacio Plenty Barber.",
      email: "Correo",
      password: "Contrasena",
      submit: "Ingresar",
      loading: "Ingresando...",
      backHome: "Volver",
      forgot: "Olvide mi contrasena",
      loadingFallback: "Cargando acceso...",
      separator: "o",
      google: "Continuar con Google",
      noAccount: "Aun no tienes cuenta?",
      createAccount: "Crear cuenta de negocio",
      businessUserRequired: "Tu cuenta esta autenticada, pero no esta conectada a un usuario activo del negocio.",
      unauthorized: "No tienes permiso para acceder a esa area.",
      invalidCredentials: "Credenciales invalidas. Crea una cuenta primero o revisa correo y contrasena.",
      genericError: "No pudimos iniciar sesion. Revisa la configuracion e intenta de nuevo.",
      demoUnavailable: "El acceso demo no esta disponible. Configura Supabase en .env.local."
    },
    signup: {
      title: "Crear cuenta de negocio",
      subtitle: "Crea el usuario propietario, el espacio del negocio y creditos iniciales.",
      businessName: "Nombre del negocio",
      ownerName: "Nombre completo del propietario",
      email: "owner@salon.com",
      password: "Contrasena, minimo 8 caracteres",
      submit: "Crear cuenta",
      loading: "Creando cuenta...",
      separator: "o",
      google: "Continuar con Google",
      already: "Ya tengo una cuenta"
    },
    onboarding: {
      title: "Completa tu espacio",
      subtitle: "Tu cuenta de Google esta activa. Ahora crea el espacio del negocio.",
      businessName: "Nombre del negocio",
      fullName: "Tu nombre completo",
      phone: "Telefono del negocio",
      submit: "Crear espacio",
      loading: "Creando espacio..."
    },
    forgotPassword: {
      title: "Restablecer contrasena",
      subtitle: "Enviaremos un enlace seguro a tu correo.",
      sent: "Revisa tu correo para abrir el enlace de restablecimiento.",
      email: "owner@salon.com",
      submit: "Enviar enlace",
      loading: "Enviando enlace...",
      backLogin: "Volver al login"
    }
  },
  en: {
    nav: { pricing: "Pricing", login: "Login", dashboard: "Dashboard" },
    landing: {
      badge: "Premium AI BeautyTech",
      subtitle:
        "AI-powered visagism reports for barbershops, salons and beauty businesses that want to sell premium advice, retain clients and deliver memorable results.",
      primaryCta: "I want it for my business",
      secondaryCta: "Sign in",
      clientReport: "Client Report",
      done: "Done",
      heroCardTitle: "Oval balance",
      heroCardText:
        "Soft volume, defined sides and warm tonal accents create a polished look aligned with the client's visible facial structure.",
      faceShape: "Face shape",
      colorimetry: "Colorimetry",
      stylePlan: "Style plan",
      howItWorks: "How it works",
      workflowTitle: "Designed for real salon workflows.",
      benefits: [
        "Premium client consultations in minutes",
        "Structured AI analysis with stylist-friendly language",
        "Branded PDF reports ready to share",
        "Credit-based business model for scalable revenue"
      ],
      steps: [
        { title: "Upload", text: "Capture or upload a clear client photo." },
        { title: "Analyze", text: "Generate facial morphology and colorimetry insights." },
        { title: "Deliver", text: "Share a branded PDF by WhatsApp or download." }
      ],
      cards: [
        { title: "Premium experience", text: "Give clients something concrete, elegant and easy to understand." },
        { title: "Branded reports", text: "Every result is prepared for PDF delivery and business branding." },
        { title: "Built for trust", text: "Server-side keys, private storage patterns and role-based architecture." }
      ]
    },
    login: {
      title: "Business Login",
      subtitle: "Access your Plenty Barber workspace.",
      email: "Email",
      password: "Password",
      submit: "Login",
      loading: "Signing in...",
      backHome: "Back home",
      forgot: "Forgot password?",
      loadingFallback: "Loading login...",
      separator: "or",
      google: "Continue with Google",
      noAccount: "No account yet?",
      createAccount: "Create business account",
      businessUserRequired: "Your account is authenticated but is not attached to an active business user.",
      unauthorized: "You do not have permission to access that area.",
      invalidCredentials: "Invalid credentials. Create an account first or check the email and password.",
      genericError: "Unable to sign in. Check your configuration and try again.",
      demoUnavailable: "Demo login is not available. Configure Supabase credentials in .env.local."
    },
    signup: {
      title: "Create business account",
      subtitle: "Create the owner user, business workspace and starter credits.",
      businessName: "Business name",
      ownerName: "Owner full name",
      email: "owner@salon.com",
      password: "Password, minimum 8 characters",
      submit: "Create account",
      loading: "Creating account...",
      separator: "or",
      google: "Continue with Google",
      already: "I already have an account"
    },
    onboarding: {
      title: "Complete your workspace",
      subtitle: "Your Google account is active. Now create the business workspace.",
      businessName: "Business name",
      fullName: "Your full name",
      phone: "Business phone",
      submit: "Create workspace",
      loading: "Creating workspace..."
    },
    forgotPassword: {
      title: "Reset password",
      subtitle: "Send a secure reset link to your email.",
      sent: "Check your email for the reset link.",
      email: "owner@salon.com",
      submit: "Send reset link",
      loading: "Sending reset link...",
      backLogin: "Back to login"
    }
  },
  pt: {
    nav: { pricing: "Precos", login: "Entrar", dashboard: "Painel" },
    landing: {
      badge: "BeautyTech premium com IA",
      subtitle:
        "Relatorios de visagismo com IA para barbearias, saloes e negocios de beleza que querem vender consultoria premium, fidelizar clientes e entregar resultados memoraveis.",
      primaryCta: "Quero para meu negocio",
      secondaryCta: "Entrar",
      clientReport: "Relatorio do cliente",
      done: "Pronto",
      heroCardTitle: "Equilibrio oval",
      heroCardText:
        "Volume suave, laterais definidas e tons quentes criam um visual polido alinhado com a estrutura facial visivel do cliente.",
      faceShape: "Formato facial",
      colorimetry: "Colorimetria",
      stylePlan: "Plano de estilo",
      howItWorks: "Como funciona",
      workflowTitle: "Projetado para fluxos reais de salao.",
      benefits: [
        "Consultas premium em minutos",
        "Analise estruturada com linguagem profissional",
        "Relatorios PDF de marca prontos para compartilhar",
        "Modelo de creditos escalavel"
      ],
      steps: [
        { title: "Envie", text: "Capture ou envie uma foto clara do cliente." },
        { title: "Analise", text: "Gere morfologia facial e colorimetria." },
        { title: "Entregue", text: "Compartilhe um PDF de marca por WhatsApp ou baixe." }
      ],
      cards: [
        { title: "Experiencia premium", text: "Entregue algo concreto, elegante e facil de entender." },
        { title: "Relatorios de marca", text: "Cada resultado fica pronto para PDF e branding do negocio." },
        { title: "Criado para confianca", text: "Chaves server-side, armazenamento privado e arquitetura por funcoes." }
      ]
    },
    login: {
      title: "Login do negocio",
      subtitle: "Acesse seu espaco Plenty Barber.",
      email: "Email",
      password: "Senha",
      submit: "Entrar",
      loading: "Entrando...",
      backHome: "Voltar",
      forgot: "Esqueci minha senha",
      loadingFallback: "Carregando login...",
      separator: "ou",
      google: "Continuar com Google",
      noAccount: "Ainda nao tem conta?",
      createAccount: "Criar conta do negocio",
      businessUserRequired: "Sua conta esta autenticada, mas nao esta conectada a um usuario ativo do negocio.",
      unauthorized: "Voce nao tem permissao para acessar essa area.",
      invalidCredentials: "Credenciais invalidas. Crie uma conta primeiro ou revise email e senha.",
      genericError: "Nao foi possivel entrar. Revise a configuracao e tente novamente.",
      demoUnavailable: "O login demo nao esta disponivel. Configure Supabase em .env.local."
    },
    signup: {
      title: "Criar conta do negocio",
      subtitle: "Crie o usuario proprietario, o espaco do negocio e creditos iniciais.",
      businessName: "Nome do negocio",
      ownerName: "Nome completo do proprietario",
      email: "owner@salon.com",
      password: "Senha, minimo 8 caracteres",
      submit: "Criar conta",
      loading: "Criando conta...",
      separator: "ou",
      google: "Continuar com Google",
      already: "Ja tenho uma conta"
    },
    onboarding: {
      title: "Complete seu espaco",
      subtitle: "Sua conta Google esta ativa. Agora crie o espaco do negocio.",
      businessName: "Nome do negocio",
      fullName: "Seu nome completo",
      phone: "Telefone do negocio",
      submit: "Criar espaco",
      loading: "Criando espaco..."
    },
    forgotPassword: {
      title: "Redefinir senha",
      subtitle: "Enviaremos um link seguro para seu email.",
      sent: "Verifique seu email para abrir o link de redefinicao.",
      email: "owner@salon.com",
      submit: "Enviar link",
      loading: "Enviando link...",
      backLogin: "Voltar ao login"
    }
  }
} as const satisfies Record<Locale, Record<string, unknown>>;
