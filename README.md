# Invoice Management Application

A professional and responsive invoice management system built to match high-fidelity designs. This application allows users to create, view, edit, and manage invoices with ease.

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Goodluckodalonu/Invoice-app
   ```
2. Navigate to the project directory:
   ```bash
   cd invoice-app
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally
To start the development server:
```bash
npm run dev
```
The app will be available at `http://localhost:5173`.

## Architecture Explanation

The application is built using **React** with **Vite** for a fast development experience.

- **Theme System**: Utilizes CSS variables and a `ThemeContext` to handle dark and light modes seamlessly.
- **State Management**: Uses local React state (`useState`, `useEffect`) and `Context API` for global theme management.
- **Persistence**: Implements a `storage.js` utility that persists invoice data to the browser's **Local Storage**.
- **Component Structure**:
  - `Sidebar`: A responsive navigation header/sidebar.
  - `InvoiceForm`: A complex slide-out panel for creating and editing invoices.
  - `InvoiceList`: The main dashboard for viewing and filtering invoices.
  - `InvoiceDetail`: A deep-dive view into a specific invoice with action buttons.
  - `Custom Components`: Includes a bespoke `DatePicker` and `StatusBadge`.

## Trade-offs

- **Local Storage vs. Backend API**: To keep the initial setup simple and direct, data is stored in `Local Storage`. This means data is local to the device and browser.
- **Tailwind CSS**: Chosen for rapid UI development and consistent spacing/breakpoints, though it adds a larger utility-based class set to the HTML.

## Accessibility Notes

Accessibility was prioritized to ensure the app is usable by everyone:
- **Semantic HTML**: Correct use of `<main>`, `<aside>`, `<ul>/<li>`, and `<button>` elements.
- **Keyboard Navigation**:
  - **ESC Key**: Modals and side panels close gracefully when the Escape key is pressed.
  - **Focus Management**: Initial focus is automatically set when opening forms or confirmation modals.
- **Form Fields**: All inputs are properly associated with visible `<label>` elements using `htmlFor` and unique IDs.
- **Contrast & Visibility**: Color choices and font pairings were audited to ensure high readability.

## Improvements Beyond Requirements

- **Custom Date Picker**: Replaced the native browser date input with a custom React component to exactly match the Figma design aesthetics.
- **Validation Suite**: Added robust validation for email formats and enforced positive numeric values for quantity and price.
- **Animation Layer**: Integrated smooth transitions for the slide-out form and status changes to provide a "premium" software feel.
- **Responsive Layouts**: Specially tailored mobile views for the invoice details and item lists that reorganize information for better legibility on small screens.
