import { Router, Response } from 'express';
import prisma from '../db';
import { authenticate, AuthenticatedRequest } from '../middleware/authenticate';
import { validateSchema } from '../utils/schemaValidation';
import { generateForm } from '../utils/formGenerator';
import { Schema } from '../types';

const router = Router();

// Create a new form
router.post('/', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  const { title, schema } = req.body;
  const validation = validateSchema(schema);
  if (!validation.isValid) {
    return res.status(400).json({ error: validation.error });
  }
  const publicId = crypto.randomUUID();
  const form = await prisma.form.create({
    data: {
      owner: req.user.id,
      title,
      schema,
      publicId,
    },
  });
  res.json(form);
});

// Preview a form (validate and generate HTML, do not save)
router.post('/preview', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  const { schema } = req.body;
  const validation = validateSchema(schema);
  if (!validation.isValid) {
    return res.status(400).json({ error: validation.error });
  }
  const html = generateForm(schema);
  res.json({ html });
});

// Get a user's forms
router.get('/', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  const forms = await prisma.form.findMany({ where: { owner: req.user.id } });
  res.json(forms);
});

// Get a form by id (private)
router.get('/:id', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  const form = await prisma.form.findUnique({ where: { id: req.params.id } });
  if (!form || form.owner !== req.user.id) return res.status(404).json({ error: 'Not found' });
  res.json(form);
});

// Get a form by publicId (public)
router.get('/public/:publicId', async (req, res) => {
  const form = await prisma.form.findUnique({ where: { publicId: req.params.publicId } });
  if (!form) return res.status(404).json({ error: 'Not found' });
  
  // Generate HTML from the schema
  const html = generateForm(form.schema as Schema);
  
  res.json({
    id: form.id,
    title: form.title,
    publicId: form.publicId,
    html: html // Include the generated HTML
  });
});

// Submit a response to a public form
router.post('/public/:publicId/submit', async (req, res) => {
  const form = await prisma.form.findUnique({ where: { publicId: req.params.publicId } });
  if (!form) return res.status(404).json({ error: 'Form not found' });
  const response = await prisma.response.create({
    data: {
      formId: form.id,
      response: req.body.response,
    },
  });
  res.json(response);
});

// Get all responses for a form (owner only)
router.get('/:id/responses', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  const form = await prisma.form.findUnique({ where: { id: req.params.id } });
  if (!form || form.owner !== req.user.id) return res.status(404).json({ error: 'Not found' });
  const responses = await prisma.response.findMany({ where: { formId: form.id } });
  res.json(responses);
});

// Delete a form (owner only)
router.delete('/:id', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  const form = await prisma.form.findUnique({ where: { id: req.params.id } });
  if (!form || form.owner !== req.user.id) return res.status(404).json({ error: 'Not found' });
  // Delete responses first (if any)
  await prisma.response.deleteMany({ where: { formId: form.id } });
  // Delete the form
  await prisma.form.delete({ where: { id: form.id } });
  res.json({ success: true });
});

router.post('/generate-form', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const schema = req.body;
    const html = generateForm(schema);
    res.send(html);
  } catch (error) {
    res.status(400).json({ error: 'Invalid schema format' });
  }
});

export default router;