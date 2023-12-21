'use server';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(), // coerce is that convert amount to number type
  status: z.enum(['pending', 'paid']),
  date: z.string(),
});

/**
 * The omit method is used to create a new schema based on an existing one,
 * but with certain fields removed.
 * FormSchema.omit({ id: true, date: true }) is creating a new schema
 * that is identical to FormSchema, but without the id and date fields.
 */
/* CREATE */
const CreateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  /**
   * get all data from form and convert to object
   * It is useful f you're working with forms that have many fields,
   */
  //   const rawFormData = Object.fromEntries(formData.entries());

  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  try {
    await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
      `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }

  /**
   * Note how redirect is being called outside of the try/catch block.
   * This is because redirect works by throwing an error,
   * which would be caught by the catch block.
   * To avoid this, you can call redirect after try/catch.
   * redirect would only be reachable if try is successful.
   */
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

/* UPDATE */
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  const amountInCents = amount * 100;

  try {
    await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Update Invoice.',
    };
  }
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

/* DELETE */
export async function deleteInvoice(id: string) {
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
    return { message: 'Deleted Invoice.' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Invoice.' };
  }
}
