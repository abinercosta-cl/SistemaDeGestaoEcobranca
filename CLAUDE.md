# Sistema de Gestão — Estúdio Zênite Fotografia (Fase 1)

Sistema sob medida para controle de clientes, vendas/contratos e financeiro do Estúdio Zênite
Fotografia (formaturas, casamentos, 15 anos). Desenvolvido pela Quantum — Soluções e Estratégias.

## 📌 Status do projeto

- **Início do desenvolvimento:** 12/11/2026
- **Escopo contratado (Fase 1):** Cadastro de Clientes e Produtos + Vendas e Contratos +
  Financeiro Básico — **somente isso**. Nenhum outro módulo deve ser implementado nesta fase.
- **Valor fechado:** R$ 6.000,00 (50% entrada / 50% na entrega)
- **Prazo máximo de entrega:** 6 semanas a partir do início (ou seja, até ~24/12/2026), já
  testado e funcionando
- Este arquivo reflete o que foi **realmente fechado com o cliente** na reunião de 12/11/2026.
  Qualquer escopo adicional (automação, agenda, assinatura digital, PDV, RH, financeiro
  avançado) é fase futura, fora deste contrato, e **não deve ser desenvolvido agora**.

---

## ⚠️ Restrição mais importante do projeto

**O usuário principal do sistema é uma senhora de idade avançada, com baixa familiaridade com
tecnologia.** Essa restrição tem peso igual ou maior que qualquer requisito funcional. Antes de
implementar qualquer tela, pergunte: *"uma pessoa de 60+ anos, sem experiência com sistemas,
conseguiria usar isso sozinha, sem ajuda e sem treinamento?"* Se a resposta for não, a tela precisa
ser simplificada antes de ser considerada pronta — não depois.

Em caso de conflito entre "mais recurso" e "mais simples", **vença sempre pela simplicidade**.

---

## Escopo da Fase 1 (único escopo válido agora)

### Módulo 1 — Cadastro de Clientes e Produtos
- Cadastro de clientes (nome, telefone, e-mail opcional)
- Cadastro de eventos vinculados a um cliente (tipo: Turma/Fotos de formatura, Casamento,
  15 anos; data; local opcional)
- Catálogo de produtos/pacotes por tipo de evento

### Módulo 2 — Vendas e Contratos
- Contrato simples: vínculo entre cliente + evento + produtos/pacotes contratados + valor total
- Geração automática de número de protocolo após o fechamento da venda

### Módulo 3 — Financeiro Básico
- Geração de cobrança vinculada ao contrato (nome do cliente, telefone, número de protocolo,
  valor, forma de pagamento = Pix)
- Registro de status de pagamento (Pendente / Pago)
- Histórico de pagamentos por cliente
- Relatório simples: total recebido no mês, total pendente, lista de cobranças em aberto

### Fora de escopo nesta fase (NÃO implementar)
Automação de lembretes via WhatsApp/e-mail, agenda/calendário, assinatura digital de contratos,
controle de despesas/margem por evento, vendas diretas (PDV), módulo de RH. Esses itens só
entram em fases futuras, com proposta e orçamento próprios, após a entrega e validação desta
Fase 1.

---

## Diretrizes de Design e UX (obrigatórias em toda tela)

Essas regras valem para **qualquer** componente de interface criado neste projeto, sem exceção.

1. **Fontes grandes.** Texto de corpo nunca menor que 16px; títulos e botões a partir de 18–20px.
   Nunca use fontes pequenas "para caber mais coisa na tela".
2. **Alto contraste.** Texto escuro sobre fundo claro (ou vice-versa) sempre acima dos padrões
   WCAG AA. Evitar cinza-claro sobre branco, texto sobre imagem sem overlay, etc.
3. **Botões grandes e espaçados.** Área mínima de toque de 44×44px, com espaçamento generoso
   entre botões para evitar cliques errados.
4. **Navegação rasa, nunca profunda.** No máximo 2 níveis de navegação até qualquer ação
   (ex.: Menu → Cobranças → [ação]). Evitar menus aninhados, abas dentro de abas, breadcrumbs
   complexos.
5. **Um objetivo por tela.** Prefira fluxos lineares (passo 1, passo 2, passo 3) a formulários
   longos com muitos campos simultâneos. Se um cadastro tem mais de ~6 campos, considere dividir
   em etapas.
6. **Ícone + texto, nunca só ícone.** Todo botão ou ação importante leva um rótulo em texto
   simples ao lado do ícone (ex.: "🗑️ Excluir", não só o ícone).
7. **Confirmação em linguagem simples para ações destrutivas.** Nunca excluir ou cancelar sem
   confirmação. Texto do tipo: *"Tem certeza que deseja excluir o cliente Maria da Silva? Essa
   ação não pode ser desfeita."* — nunca jargão técnico ("Confirmar operação irreversível").
8. **Feedback visual claro.** Toda ação (salvar, excluir, erro) precisa de um retorno visual
   óbvio: cor (verde/vermelho), ícone e mensagem em português simples. Nunca falhar silenciosamente.
9. **Sem jargão técnico na interface.** Nada de "payload", "token expirado", "erro 500". Sempre
   traduzir para linguagem humana: "Não foi possível salvar, tente novamente" em vez de mensagens
   de erro técnicas.
10. **Sessão não deve expirar rápido.** Evitar timeout de sessão curto que derrube a usuária no
    meio de um cadastro. Se expirar, salvar o que foi digitado antes de pedir login novamente.
11. **Botão de ação principal sempre no mesmo lugar.** Ex.: "Salvar" sempre no canto inferior
    direito, em todas as telas, com a mesma cor. Consistência reduz a curva de aprendizado.
12. **Evitar interações "modernas" arriscadas para o público.** Nada de drag-and-drop, swipe para
    ações ocultas, menus de contexto (clique direito), ou gestos não óbvios. Tudo deve ser clicável
    e visível.
13. **Testar sempre em tela de desktop comum primeiro** (provavelmente o ambiente real de uso no
    estúdio), mas manter responsivo para tablet como segundo cenário.
14. **Prefira edição inline simples a telas de edição separadas** quando possível, mas sem abrir
    mão da clareza — um campo editável deve deixar óbvio que é editável (ex.: ícone de lápis + texto
    "Editar").

> Ao gerar qualquer componente novo, aplique estas regras automaticamente. Não é necessário que o
> usuário peça "faça acessível" a cada tela — isso é padrão do projeto.

---

## Stack técnico

- **Framework:** Next.js (App Router), TypeScript
- **Banco de dados:** Prisma ORM + SQLite em desenvolvimento (avaliar Postgres se for para produção
  com mais de um usuário simultâneo)
- **Autenticação:** JWT com cookies HTTP-Only (mesmo padrão já validado no EstoquePRO — usar
  `jose` para o JWT, middleware de proteção de rotas, guards `withAuth`)
- **Estilo:** Tailwind CSS, com tema de alto contraste e escala de fontes maior que o padrão,
  definida como tokens de design (ver seção abaixo)
- **Controle de versão:** Git, commits em português (ver convenções abaixo)
- **Deploy:** VPS (Hostinger ou DigitalOcean) — decidir só após a Fase 1 estar pronta localmente

### Tokens de design sugeridos (ponto de partida)
```
Fonte base do corpo:      16px (1rem) — mínimo absoluto
Fonte de títulos de tela: 22–26px
Fonte de botões:          18px, peso semibold/bold
Altura mínima de botão:   48px
Espaçamento entre ações:  mínimo 12px
Cor de sucesso:           verde contrastante (ex. #1B8A5A sobre fundo claro)
Cor de erro/alerta:       vermelho contrastante (ex. #C0392B sobre fundo claro)
Cor de ação primária:     alto contraste contra o fundo, usada de forma consistente em todo o app
```
Ajustar a paleta final de acordo com a identidade visual que for definida com o cliente, mas manter
os contrastes e tamanhos acima como piso mínimo, não como teto.

---

## Estrutura de pastas sugerida

```
/app
  /(auth)/login
  /(dashboard)
    /clientes
    /eventos
    /contratos
    /cobrancas
    /financeiro
/components
  /ui          → componentes de design system (botão, input, modal — já com os tokens acima)
  /forms
/lib
  /auth
  /db          → cliente Prisma
/prisma
  schema.prisma
```

---

## Convenções de código

- Componentes em PascalCase, arquivos de componente `.tsx`
- Commits em português, no formato `tipo: descrição curta` (ex.: `feat: cadastro de clientes`,
  `fix: validação de telefone no cadastro`)
- Toda nova tela de cadastro/edição deve ter validação de formulário com mensagens de erro em
  português simples, próximas ao campo com problema
- Dados sensíveis (ex.: valor de contrato) sempre formatados em R$ com separador de milhar

---

## Critério de aceite da Fase 1

A Fase 1 só está pronta para entrega quando:

- [ ] É possível cadastrar um cliente, um evento e vincular produtos/pacotes em menos de 2 minutos,
      sem consultar ajuda
- [ ] É possível gerar uma cobrança Pix com protocolo a partir de um contrato existente
- [ ] É possível marcar uma cobrança como paga e ver isso refletido no relatório financeiro
      imediatamente
- [ ] Todas as telas passam no teste da pergunta da seção "Restrição mais importante do projeto"
- [ ] Nenhuma tela exige mais de 2 cliques/níveis de navegação para ser alcançada a partir do menu
      principal
- [ ] Sistema testado de ponta a ponta com o fluxo real do estúdio antes da entrega final

---

## Como usar este arquivo

Este arquivo deve ficar na raiz do repositório como `CLAUDE.md`. A Claude Code lê esse arquivo
automaticamente a cada sessão, então as diretrizes acima (especialmente as de design e de escopo)
devem ser aplicadas sem precisar ser repetidas a cada prompt. Ao pedir uma nova funcionalidade,
você pode ser direto (ex.: "cria a tela de cadastro de clientes") — as regras de acessibilidade e
o escopo da Fase 1 já estão fixados aqui. Qualquer pedido de funcionalidade fora da lista da
"Fase 1" acima deve ser sinalizado antes de ser implementado, já que está fora do que foi
contratado nesta etapa.
