
'use server';
import { z } from 'zod';
import { aiProjectQualification, type AIProjectQualificationInput, type AIProjectQualificationOutput } from '@/ai/flows/ai-project-qualification';
import { getGeneralSettings, saveGeneralSettings } from '@/services/settings';
import type { GeneralSettings, Customer, HeaderCTASettings } from '@/types/settings';
import { revalidatePath } from 'next/cache';
import { getAllLeads, Lead } from '@/services/leads';
import { v4 as uuidv4 } from 'uuid';
import { headerSettingsSchema } from '@/lib/validators/headerSettings.zod';


export async function qualifyProjectAction(input: AIProjectQualificationInput): Promise<AIProjectQualificationOutput> {
  // Here you could add server-side validation or logging if needed
  try {
    const result = await aiProjectQualification(input);
    return result;
  } catch (error) {
    console.error("Error in AI qualification flow:", error);
    // Return a structured error response that matches the expected output type
    return {
        qualified: false,
        nextQuestion: 'An unexpected error occurred. Please try again later.',
    };
  }
}

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
  gdpr: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms." }),
  }),
});

export type ContactFields = 'name' | 'email' | 'message' | 'gdpr';

export type FormErrors = Partial<Record<ContactFields, string[]>>;

export type FormState = {
  message: string;
  errors?: FormErrors;
};


export async function sendContactMessage(prevState: FormState, formData: FormData): Promise<FormState> {
  try {
    const validatedFields = contactFormSchema.safeParse({
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
      gdpr: formData.get('gdpr') === 'on',
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Please fill in all fields correctly.',
      };
    }
    
    // In a real application, you would send an email or save to a database.
    // For this example, we'll just log the data to the console.
    console.log('New Contact Form Submission:');
    console.log(validatedFields.data);

    return {
      message: 'Thank you for your message! We will get back to you as soon as possible.',
      errors: {},
    };
  } catch (error) {
      console.error("Error sending contact message:", error);
      return {
          message: 'A server error occurred. Please try again.',
          errors: {},
      }
  }
}

export async function getSettingsAction(): Promise<GeneralSettings | null> {
    try {
        return getGeneralSettings();
    } catch(error) {
        console.error("Error in getSettingsAction: ", error);
        return null;
    }
}

export async function saveSettingsAction(settings: Partial<GeneralSettings>): Promise<{ success: boolean; message: string }> {
    try {
        await saveGeneralSettings(settings);
        revalidatePath('/', 'layout');
        revalidatePath('/cms', 'layout');
        return { success: true, message: 'Settings have been saved.' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'An error occurred during saving.' };
    }
}

export async function getLeadsAction(): Promise<Lead[]> {
    try {
        return getAllLeads();
    } catch (error) {
        console.error("Error in getLeadsAction: ", error);
        return [];
    }
}

export async function getLeadsForClient(): Promise<Lead[]> {
    try {
        const leads = await getAllLeads();
        // Sikrer at 'createdAt' er en streng, som er sikker at sende til klienten
        return leads.map(lead => ({
            ...lead,
            createdAt: lead.createdAt.toISOString(),
        }));
    } catch (error) {
        console.error("Error in getLeadsForClient: ", error);
        return [];
    }
}


export async function saveCustomerAction(customerData: Omit<Customer, 'id'>): Promise<{ success: boolean; message: string; customers: Customer[] }> {
    try {
        const settings = await getGeneralSettings() || {};
        const customers = settings?.customers || [];
        const newCustomer: Customer = { ...customerData, id: uuidv4() };
        const updatedCustomers = [...customers, newCustomer];
        await saveGeneralSettings({ customers: updatedCustomers });
        revalidatePath('/cms/customers');
        revalidatePath('/');
        return { success: true, message: 'Customer added.', customers: updatedCustomers };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'An error occurred.', customers: [] };
    }
}

export async function deleteCustomerAction(customerId: string): Promise<{ success: boolean; message: string; customers: Customer[] }> {
    try {
        const settings = await getGeneralSettings() || {};
        const customers = settings?.customers || [];
        const updatedCustomers = customers.filter(c => c.id !== customerId);
        await saveGeneralSettings({ customers: updatedCustomers });
        revalidatePath('/cms/customers');
        revalidatePath('/');
        return { success: true, message: 'Customer deleted.', customers: updatedCustomers };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'An error occurred.', customers: [] };
    }
}

export async function getCustomersAction(): Promise<Customer[]> {
    try {
        const settings = await getGeneralSettings();
        return settings?.customers || [];
    } catch(error) {
        console.error("Error in getCustomersAction: ", error);
        return [];
    }
}
