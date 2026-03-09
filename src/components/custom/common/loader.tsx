import { Loader2 } from 'lucide-react'

interface LoaderProps {
    className?: string;
    size?: number;
    loaderClassName?: string;
}
const Loader = ({ className, size, loaderClassName }: LoaderProps) => {
    return (
        <div className={className}>
            <Loader2 size={size} className={`text-primary animate-spin font-bold not-last:mr-2 ${loaderClassName}`} />
        </div>
    )
}

export default Loader