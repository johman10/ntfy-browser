import * as React from "react";
import { Link, Button, Typography, Container } from "@mui/material";
import { i18n } from "webextension-polyfill";

interface State {
  error: boolean;
  stackTrace: string | null;
}

export default class ErrorBoundary extends React.Component<
  { children?: React.ReactNode },
  State
> {
  public state = {
    error: false,
    stackTrace: null,
  };

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[ErrorBoundary] Error caught", error, info);
    const prettierOriginalStack = info.componentStack
      .trim()
      .split("\n")
      .map((line) => `  at ${line}`)
      .join("\n");
    this.setState({
      error: true,
      stackTrace: prettierOriginalStack,
    });
  }

  copyStack() {
    if (!this.state.stackTrace) return;

    navigator.clipboard.writeText(this.state.stackTrace);
  }

  render() {
    if (this.state.error) {
      return (
        <Container>
          <Typography variant="h2">
            {i18n.getMessage("errorBoundaryTitle")} 😮
          </Typography>
          <Typography>
            {i18n.getMessage("errorBoundaryDescription")}
            <br />
            <Link href="https://github.com/johman10/ntfy-browser/issues">
              {i18n.getMessage("errorBoundaryDescriptionGithub")}
            </Link>
          </Typography>
          <Typography variant="h3">
            {i18n.getMessage("errorBoundaryStackTraceTitle")}
          </Typography>
          <pre>{this.state.stackTrace}</pre>
          <Typography>
            <Button variant="outlined" onClick={() => this.copyStack()}>
              {i18n.getMessage("erroBoundaryStackTraceCopy")}
            </Button>
          </Typography>
        </Container>
      );
    }
    return this.props.children;
  }
}
