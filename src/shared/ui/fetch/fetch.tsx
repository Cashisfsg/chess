import useSWR from "swr";

type FetchProps<D> = {
    cacheKey: string;
    queryFn: any;
    renderSuccess: (data: D) => React.ReactElement;
    loadingFallback?: React.ReactNode;
    renderError?: (error: string) => React.ReactElement;
};

export const Fetch = <D,>({
    cacheKey,
    queryFn,
    renderSuccess,
    loadingFallback = <p>Loading...</p>,
    renderError = (error: string) => <pre>{error}</pre>
}: FetchProps<D>) => {
    const { data, isLoading, error } = useSWR(cacheKey, queryFn);

    if (isLoading) return loadingFallback;
    if (error) return renderError(error);
    if (data) return renderSuccess(data);

    return null;
};
