import { dataService } from '../services/dataService';

export function runCriticalWorkflowTests() {
  console.log('--- Running CreatorFlow Critical Workflow Tests ---');
  let passed = 0;
  let total = 0;

  function assert(condition: boolean, testName: string) {
    total++;
    if (condition) {
      console.log(`✓ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`✗ [FAIL] ${testName}`);
    }
  }

  // 1. Test Budget Request Creation
  const newReq = dataService.createBudgetRequest({
    clientId: 'client-test-1',
    clientName: 'Test Client',
    title: 'Automated Test Wedding Shoot in Kandy',
    category: 'Weddings',
    location: 'Kandy, Sri Lanka',
    budgetLkr: 150000,
    eventDate: '2025-08-15',
    isDateFlexible: false,
    durationHours: 6,
    requiredServices: ['Candid Photography', 'Poruwa Highlights'],
    expectedDeliverables: ['300 Photos', 'Cloud Gallery'],
    additionalRequirements: 'Automated test execution',
    status: 'open',
  });
  assert(newReq.id.startsWith('req-'), 'Budget Request creation produces valid ID');
  assert(newReq.budgetLkr === 150000, 'Budget LKR stored accurately');

  // 2. Test Offer Submission
  const offer = dataService.submitOffer({
    requestId: newReq.id,
    photographerId: 'photo-2',
    photographerName: 'Shanaya Weerasinghe',
    photographerStudio: 'Kandy Candid Co.',
    proposedPriceLkr: 145000,
    packageDetails: 'Full day traditional Poruwa coverage',
    durationHours: 6,
    deliverables: ['350 Photos', 'Album'],
    availabilityConfirmation: 'Available on Aug 15',
    message: 'We would love to cover your Kandy wedding',
    status: 'pending',
  });
  assert(offer.id.startsWith('off-'), 'Offer submission generates valid offer record');
  assert(offer.proposedPriceLkr === 145000, 'Offer proposed price matches input');

  // 3. Test Duplicate Offer Prevention
  let duplicatePrevented = false;
  try {
    dataService.submitOffer({
      requestId: newReq.id,
      photographerId: 'photo-2',
      photographerName: 'Shanaya Weerasinghe',
      photographerStudio: 'Kandy Candid Co.',
      proposedPriceLkr: 140000,
      packageDetails: 'Duplicate offer attempt',
      durationHours: 6,
      deliverables: [],
      availabilityConfirmation: 'Available',
      message: 'Duplicate attempt',
      status: 'pending',
    });
  } catch (err: any) {
    duplicatePrevented = true;
  }
  assert(duplicatePrevented, 'Duplicate offer by same photographer on same request is rejected');

  // 4. Test Atomic Offer Acceptance & Booking Creation
  const booking = dataService.acceptOfferAndCreateBooking(newReq.id, offer.id, 'client-test-1');
  assert(booking.id.startsWith('book-'), 'Atomic acceptance generates verified booking');
  assert(booking.status === 'confirmed', 'Booking status is automatically confirmed');
  assert(booking.totalAmountLkr === 145000, 'Booking amount matches accepted offer price');
  assert(booking.outstandingBalanceLkr === 145000, 'Initial outstanding balance equals total amount');

  // 5. Test Calendar Auto-Scheduling
  const calEvents = dataService.getCalendarEvents('photo-2');
  const bookedEvent = calEvents.find(e => e.bookingId === booking.id);
  assert(Boolean(bookedEvent), 'Booking is automatically linked into Photographer calendar');
  assert(bookedEvent?.startDate === '2025-08-15', 'Calendar event date matches shoot date');

  // 6. Test Editing Project Auto-Generation
  const editingProjects = dataService.getEditingProjects('photo-2');
  const proj = editingProjects.find(p => p.bookingId === booking.id);
  assert(Boolean(proj), 'Editing project is automatically initialized in studio pipeline');
  assert(proj?.stage === 'shoot_scheduled', 'Initial editing stage is shoot_scheduled');

  // 7. Test Editing Stage Progression
  if (proj) {
    const updatedProj = dataService.updateEditingStage(proj.id, 'editing');
    assert(updatedProj.stage === 'editing', 'Editing stage transitions accurately');

    const deliveredProj = dataService.updateEditingStage(proj.id, 'final_delivery');
    assert(deliveredProj.progressPercentage === 100, 'Final delivery sets progress to 100%');
  }

  // 8. Test Financial Balance Calculation with Payment Recording
  const payment = dataService.addPayment({
    photographerId: 'photo-2',
    bookingId: booking.id,
    clientName: 'Test Client',
    amountLkr: 45000,
    paymentType: 'advance',
    paymentMethod: 'bank_transfer',
    paymentDate: '2025-08-01',
    status: 'completed',
  });
  const refreshedBooking = dataService.getBookingById(booking.id);
  assert(refreshedBooking?.advancePaidLkr === 45000, 'Advance payment updates booking advance total');
  assert(refreshedBooking?.outstandingBalanceLkr === 100000, 'Outstanding balance is accurately calculated (145000 - 45000 = 100000)');

  console.log(`\nResults: ${passed}/${total} Critical Workflow Tests Passed!`);
  return { passed, total };
}

// Auto-run if executed directly
if (typeof window !== 'undefined') {
  (window as any).runCriticalWorkflowTests = runCriticalWorkflowTests;
}
