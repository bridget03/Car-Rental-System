import {
    Pagination,
    PaginationArrow,
    PaginationEllipsis,
    PaginationEnd,
    PaginationItem,
} from "@/components/pagination/Pagination";

export default function Page() {
    return (
        <div
            style={{
                maxWidth: "900px",
                margin: "0 auto",
            }}
        >
            <h1>Pagination Component</h1>

            <Pagination>
                <PaginationEnd href="/pagination" isDisabled={false} position={"start"} />
                <PaginationArrow direction="left" href="/pagination" isDisabled={false} />
                <PaginationEllipsis />
                <PaginationItem href="/pagination" isActive={true}>
                    1
                </PaginationItem>
                <PaginationItem href="/pagination">2</PaginationItem>
                <PaginationItem href="/pagination">3</PaginationItem>
                <PaginationEllipsis />
                <PaginationArrow direction="right" href="/pagination" isDisabled={false} />
                <PaginationEnd href="/pagination" isDisabled={false} position={"end"} />
            </Pagination>
        </div>
    );
}
