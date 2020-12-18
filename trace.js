const { NodeTracerProvider } = require('@opentelemetry/node');
const { SimpleSpanProcessor } = require('@opentelemetry/tracing');
const { CollectorTraceExporter } = require('@opentelemetry/exporter-collector-grpc');
const { propagation, trace } = require("@opentelemetry/api");

const { AwsXRayIdGenerator } = require('@aws/otel-aws-xray-id-generator');
const { AWSXRayPropagator } = require('@aws/otel-aws-xray-propagator');

module.exports = (serviceName, url) => {
    propagation.setGlobalPropagator(new AWSXRayPropagator());

    const provider = new NodeTracerProvider({
        idGenerator: new AwsXRayIdGenerator(),
        plugins: {
            express: {
                enabled: true,
                path: '@opentelemetry/plugin-express'
            }
        }
    });

    const otlpExporter = new CollectorTraceExporter({
        serviceName: serviceName,
        url: url
    });

    const otlpProcessor = new SimpleSpanProcessor(otlpExporter);
    provider.addSpanProcessor(otlpProcessor);
    provider.register();

    return trace.getTracer(serviceName);
}
