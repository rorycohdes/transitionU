-- Seed data for development and testing

-- Checklist Categories
INSERT INTO checklist_categories (id, name, description, display_order)
VALUES
  ('2a8b4e2c-76d9-4ae9-97e5-6fca4a9fe0e9', 'Pre-Arrival', 'Tasks to complete before traveling to the US', 1),
  ('b3c5d7e9-f1g2-h3i4-j5k6-l7m8n9o0p1q2', 'First Week', 'Essential tasks for your first week in the US', 2),
  ('c4d5e6f7-g8h9-i0j1-k2l3-m4n5o6p7q8r9', 'First Month', 'Important tasks to complete during your first month', 3),
  ('d5e6f7g8-h9i0-j1k2-l3m4-n5o6p7q8r9s0', 'Academic Preparation', 'Tasks related to your academic success', 4),
  ('e6f7g8h9-i0j1-k2l3-m4n5-o6p7q8r9s0t1', 'Cultural Adjustment', 'Activities to help you adjust to US culture', 5);

-- Checklist Items
INSERT INTO checklist_items (id, category_id, title, description, estimated_time, difficulty, display_order, required, visa_specific, visa_types, resources)
VALUES
  ('1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6', '2a8b4e2c-76d9-4ae9-97e5-6fca4a9fe0e9', 'Apply for student visa', 'Schedule and attend visa interview at US embassy/consulate', '2-4 weeks', 'Hard', 1, TRUE, TRUE, ARRAY['F-1', 'J-1'], '{"links": [{"url": "https://travel.state.gov/content/travel/en/us-visas/study/student-visa.html", "title": "US Student Visa Information"}]}'),
  ('2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7', '2a8b4e2c-76d9-4ae9-97e5-6fca4a9fe0e9', 'Pay SEVIS Fee', 'Pay the I-901 SEVIS Fee required for all student/exchange visitor visa applicants', '1 hour', 'Easy', 2, TRUE, TRUE, ARRAY['F-1', 'J-1'], '{"links": [{"url": "https://www.fmjfee.com/", "title": "SEVIS Fee Payment Website"}]}'),
  ('3c4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8', '2a8b4e2c-76d9-4ae9-97e5-6fca4a9fe0e9', 'Book flights', 'Research and book your flights to the US', '2-3 hours', 'Medium', 3, TRUE, FALSE, NULL, '{"links": [{"url": "https://www.google.com/flights", "title": "Google Flights"}]}'),
  ('4d5e6f7g-8h9i-0j1k-2l3m-4n5o6p7q8r9', '2a8b4e2c-76d9-4ae9-97e5-6fca4a9fe0e9', 'Arrange housing', 'Secure on-campus or off-campus housing before arrival', '1-2 weeks', 'Hard', 4, TRUE, FALSE, NULL, '{"links": [{"url": "#", "title": "University Housing Portal"}]}'),
  ('5e6f7g8h-9i0j-1k2l-3m4n-5o6p7q8r9s0', '2a8b4e2c-76d9-4ae9-97e5-6fca4a9fe0e9', 'Pack essentials', 'Prepare your luggage with essential items for your stay in the US', '1-2 days', 'Medium', 5, TRUE, FALSE, NULL, NULL),
  
  ('6f7g8h9i-0j1k-2l3m-4n5o-6p7q8r9s0t1', 'b3c5d7e9-f1g2-h3i4-j5k6-l7m8n9o0p1q2', 'Check in with international office', 'Report to your university international student office', '1 hour', 'Easy', 1, TRUE, TRUE, ARRAY['F-1', 'J-1'], NULL),
  ('7g8h9i0j-1k2l-3m4n-5o6p-7q8r9s0t1u2', 'b3c5d7e9-f1g2-h3i4-j5k6-l7m8n9o0p1q2', 'Attend orientation', 'Attend international student orientation session', '1 day', 'Easy', 2, TRUE, FALSE, NULL, NULL),
  ('8h9i0j1k-2l3m-4n5o-6p7q-8r9s0t1u2v3', 'b3c5d7e9-f1g2-h3i4-j5k6-l7m8n9o0p1q2', 'Open bank account', 'Open a US bank account for managing your finances', '2 hours', 'Medium', 3, TRUE, FALSE, NULL, '{"links": [{"url": "#", "title": "Comparison of Student Bank Accounts"}]}'),
  ('9i0j1k2l-3m4n-5o6p-7q8r-9s0t1u2v3w4', 'b3c5d7e9-f1g2-h3i4-j5k6-l7m8n9o0p1q2', 'Get phone plan', 'Purchase a US phone plan or SIM card', '1 hour', 'Easy', 4, TRUE, FALSE, NULL, NULL);

-- FAQ Items
INSERT INTO faq_items (id, question, answer, category, keywords)
VALUES
  ('a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6', 'What is the SEVIS Fee?', 'The SEVIS fee is a required fee for all F, M, and J visa applicants. It supports the Student and Exchange Visitor Program (SEVP) and the computer system used to maintain information on international students and exchange visitors in the United States.', 'visa', ARRAY['SEVIS', 'fee', 'I-901', 'visa']),
  ('b2c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q7', 'How do I find housing in the US?', 'Most universities offer on-campus housing options for international students. You can also look for off-campus apartments through university resources, websites like apartments.com, or local listings. Consider factors like proximity to campus, safety, and public transportation access.', 'housing', ARRAY['housing', 'accommodation', 'apartment', 'dorm']),
  ('c3d4e5f6-g7h8-i9j0-k1l2-m3n4o5p6q7r8', 'How can I open a bank account?', 'To open a bank account in the US, you''ll typically need your passport, student visa, university admission letter, and sometimes proof of address. Major banks often have student accounts with reduced fees. Compare options for international transfer fees, ATM access, and mobile banking features.', 'finance', ARRAY['bank', 'account', 'finance', 'money']),
  ('d4e5f6g7-h8i9-j0k1-l2m3-n4o5p6q7r8s9', 'What is a credit score and why is it important?', 'A credit score is a number that represents your creditworthiness in the US financial system. It affects your ability to get loans, credit cards, apartments, and even some jobs. Building credit early by getting a secured credit card, paying bills on time, and maintaining low balances is important for your financial future in the US.', 'finance', ARRAY['credit', 'score', 'finance', 'loan']),
  ('e5f6g7h8-i9j0-k1l2-m3n4-o5p6q7r8s9t0', 'How does the US grading system work?', 'Most US universities use a letter grading system: A (excellent), B (good), C (satisfactory), D (poor), and F (failing). These translate to a 4.0 GPA scale where A=4.0, B=3.0, etc. Some schools use plus/minus modifiers (A-, B+). Class participation, assignments, midterms, and finals all contribute to your final grade.', 'academics', ARRAY['grades', 'GPA', 'academics', 'study']),
  ('f6g7h8i9-j0k1-l2m3-n4o5-p6q7r8s9t0u1', 'What is cultural shock and how do I deal with it?', 'Cultural shock is the feeling of disorientation when experiencing an unfamiliar way of life. It often includes stages of honeymoon, frustration, adjustment, and acceptance. Cope by maintaining connection with home while building local social networks, keeping an open mind, giving yourself time to adjust, and seeking support from international student services.', 'cultural', ARRAY['culture', 'shock', 'adjustment', 'homesick']),
  ('g7h8i9j0-k1l2-m3n4-o5p6-q7r8s9t0u1v2', 'Can I work as an international student in the US?', 'F-1 students can work on-campus up to 20 hours per week during academic terms, and full-time during breaks. After your first academic year, you may qualify for Curricular Practical Training (CPT) for off-campus work related to your major. After graduation, Optional Practical Training (OPT) allows work in your field for up to 12 months (36 for STEM fields).', 'work', ARRAY['job', 'work', 'employment', 'CPT', 'OPT', 'income']); 