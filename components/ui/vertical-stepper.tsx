interface Step {
    date: string | Date;
    label: string;
    description?: string;
}

export const VerticalStepper = ({ steps }: { steps: Step[] }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);



    return (
        <div className="relative">
            {steps.map((step, index) => {
                const stepDate = new Date(step.date);
                stepDate.setHours(0, 0, 0, 0);

                const isCompleted = stepDate < today; // Sudah lewat (kemarin/masa lalu)
                const isCurrent = stepDate.getTime() === today.getTime(); // Hari ini
                const isUpcoming = stepDate > today; // Belum dimulai (besok/masa depan)

                return (
                    <div key={index} className="relative pb-8 last:pb-0">
                        {/* Vertical Line */}
                        {index !== steps.length - 1 && (
                            <div
                                className={`absolute left-3 top-8 w-0.5 h-full ${isCompleted ? 'bg-primary' : 'bg-gray-300'
                                    }`}
                            />
                        )}

                        {/* Step Item */}
                        <div className="flex items-start gap-4">
                            {/* Step Circle */}
                            <div
                                className={`relative z-10 shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${isCompleted
                                    ? 'bg-primary border-primary'
                                    : isCurrent
                                        ? 'bg-white border-primary'
                                        : 'bg-white border-gray-300'
                                    }`}
                            >
                                {isCompleted && (
                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                )}
                                {isCurrent && (
                                    <div className="w-2 h-2 bg-primary rounded-full" />
                                )}
                            </div>

                            {/* Step Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <div className={`font-medium ${isCompleted ? 'font-bold' : isCurrent ? 'text-gray-900' : 'text-gray-500'
                                        }`}>
                                        {step.label}
                                    </div>

                                </div>
                                {step.description && (
                                    <div className={`text-sm mt-1 ${isUpcoming ? 'text-gray-400' : 'text-gray-600'
                                        }`}>
                                        {step.description}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};