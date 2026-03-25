import React, { useState, useEffect } from "react";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Button from "../ui/Button";
import "../style/stripe.css";

// Ta clé publique Stripe (mode test)
const stripePromise = loadStripe(
  "pk_live_51PRLy9DJ99odiZ4UjhwziFEiYFSMyd3BAg2CZwZFytBB2kYearYHa0CAiEf8Dfb6GZLJvRY955RFEpIhh2egK2fv00ZptLm5WP",
);

interface PaiementStripeProps {
  amount: number;
  customerName: string;
  customerEmail: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

// Composant interne qui gère le formulaire de paiement
const CheckoutForm: React.FC<PaiementStripeProps> = ({
  amount,
  customerName,
  customerEmail,
  onSuccess,
  onError,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "bank">("card");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        throw new Error(submitError.message);
      }

      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/confirmation`,
          payment_method_data: {
            billing_details: {
              name: customerName,
              email: customerEmail,
            },
          },
        },
        redirect: "if_required",
      });

      if (confirmError) {
        throw new Error(confirmError.message);
      }

      // Paiement réussi
      onSuccess();
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Erreur de paiement";
      setErrorMessage(errorMsg);
      onError(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  // Options pour l'affichage du formulaire
  const paymentElementOptions = {
    layout: "tabs" as const, // Affiche les onglets (carte, virement)
    defaultValues: {
      billingDetails: {
        name: customerName,
        email: customerEmail,
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="stripe-form">
      <div className="stripe-amount">
        <h3>Total à payer : {amount.toFixed(2)} €</h3>
      </div>

      {/* Sélecteur de méthode de paiement (optionnel, Stripe gère déjà les onglets) */}
      <div className="payment-methods">
        <button
          type="button"
          className={`payment-method-btn ${paymentMethod === "card" ? "active" : ""}`}
          onClick={() => setPaymentMethod("card")}
        >
          💳 Carte bancaire
        </button>
        <button
          type="button"
          className={`payment-method-btn ${paymentMethod === "bank" ? "active" : ""}`}
          onClick={() => setPaymentMethod("bank")}
        >
          🏦 Virement bancaire
        </button>
      </div>

      {/* Formulaire Stripe qui s'adapte automatiquement */}
      <div className="stripe-elements">
        <PaymentElement options={paymentElementOptions} />
      </div>

      {errorMessage && <div className="stripe-error">❌ {errorMessage}</div>}

      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="stripe-button"
      >
        {isProcessing
          ? "Traitement en cours..."
          : `Payer ${amount.toFixed(2)} €`}
      </Button>

      <p className="stripe-secure">🔒 Paiement sécurisé par Stripe</p>
    </form>
  );
};

// Composant principal
const PaiementStripe: React.FC<PaiementStripeProps> = ({
  amount,
  customerName,
  customerEmail,
  onSuccess,
  onError,
}) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const createPaymentIntent = async () => {
      setIsLoading(true);
      /* try {
        // Appel à ton backend pour créer un PaymentIntent
        // Pour l'instant on simule, mais plus tard tu remplaces par ton vrai endpoint
        const response = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: Math.round(amount * 100), // Stripe utilise les centimes
            currency: "eur",
            customerName,
            customerEmail,
          }),
        });

        if (!response.ok) {
          throw new Error("Erreur lors de la création du paiement");
        }

        const data = await response.json();
        setClientSecret(data.clientSecret);*/
      try {
        // Simulation d'un appel API
        // À remplacer par : fetch('/api/create-payment-intent', { method: 'POST', body: JSON.stringify({ amount }) })
        setTimeout(() => {
          // Ceci est un faux clientSecret, NE PAS UTILISER EN PRODUCTION
          const fakeClientSecret = "pi_fake_secret_" + Date.now();
          setClientSecret(fakeClientSecret);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Erreur:", error);
        onError("Impossible d'initialiser le paiement");
      } finally {
        setIsLoading(false);
      }
    };

    createPaymentIntent();
  }, [amount, customerName, customerEmail, onError]);

  if (isLoading) {
    return (
      <div className="stripe-loading">
        <div className="spinner"></div>
        <p>Chargement du paiement...</p>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="stripe-error">
        <p>❌ Impossible d'initialiser le paiement</p>
        <Button onClick={() => window.location.reload()}>Réessayer</Button>
      </div>
    );
  }

  const options = {
    clientSecret,
    appearance: {
      theme: "stripe" as const,
      variables: {
        colorPrimary: "#ff6b6b",
        colorBackground: "#ffffff",
        colorText: "#30313d",
        colorDanger: "#df1b41",
        fontFamily: "system-ui, -apple-system, sans-serif",
        spacingUnit: "4px",
        borderRadius: "8px",
      },
      rules: {
        ".Tab": {
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
          padding: "12px",
        },
        ".Tab--selected": {
          borderColor: "#ff6b6b",
          backgroundColor: "#fff5f5",
        },
      },
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm
        amount={amount}
        customerName={customerName}
        customerEmail={customerEmail}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Elements>
  );
};

export default PaiementStripe;
