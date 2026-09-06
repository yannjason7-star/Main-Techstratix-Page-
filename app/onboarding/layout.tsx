export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-[32px] border border-gray-200 shadow-xl overflow-hidden">
        {children}
      </div>
    </div>
  );
}